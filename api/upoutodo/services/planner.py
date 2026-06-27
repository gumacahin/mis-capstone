from dataclasses import dataclass
from datetime import timedelta

from django.db import transaction
from django.db.models import Avg, Count
from django.utils import timezone

from upoutodo.models import EnergyCheckIn, PlanItem, Task, TodayPlan, TodayPlanFeedback

DEFAULT_AVAILABLE_MINUTES = 120
MAX_PLAN_ITEMS = 6
LEGACY_PRIORITY_MAP = {
    "0": Task.Priority.NONE,
    "1": Task.Priority.LOW,
    "2": Task.Priority.MEDIUM,
    "3": Task.Priority.HIGH,
}


@dataclass(frozen=True)
class TaskSuggestion:
    task: Task
    score: float
    reason: str
    estimated_minutes: int


def today_for_user():
    return timezone.localdate()


def get_or_create_check_in(user, target_date=None):
    target_date = target_date or today_for_user()
    check_in, _ = EnergyCheckIn.objects.get_or_create(
        user=user,
        date=target_date,
        defaults={
            "energy_level": EnergyCheckIn.EnergyLevel.MEDIUM,
            "available_minutes": DEFAULT_AVAILABLE_MINUTES,
            "focus_mode": EnergyCheckIn.FocusMode.FLEXIBLE,
        },
    )
    return check_in


def save_check_in(user, data, target_date=None):
    target_date = target_date or today_for_user()
    check_in, _ = EnergyCheckIn.objects.update_or_create(
        user=user,
        date=target_date,
        defaults={
            "energy_level": data.get("energy_level", EnergyCheckIn.EnergyLevel.MEDIUM),
            "available_minutes": data.get(
                "available_minutes", DEFAULT_AVAILABLE_MINUTES
            ),
            "focus_mode": data.get("focus_mode", EnergyCheckIn.FocusMode.FLEXIBLE),
            "context": data.get("context", ""),
        },
    )
    return check_in


def get_today_plan(user, target_date=None):
    target_date = target_date or today_for_user()
    check_in = get_or_create_check_in(user, target_date)
    plan, created = TodayPlan.objects.get_or_create(
        user=user,
        date=target_date,
        defaults={"check_in": check_in, "generated_at": timezone.now()},
    )

    if plan.check_in_id != check_in.id:
        plan.check_in = check_in
        plan.save(update_fields=["check_in", "updated_at"])

    if created or not plan.items.exists():
        return rebuild_today_plan(user, target_date)

    return plan


def get_planner_evaluation_summary():
    plan_count = TodayPlan.objects.count()
    feedback_count = TodayPlanFeedback.objects.count()
    feedback_averages = TodayPlanFeedback.objects.aggregate(
        average_helpfulness_rating=Avg("helpfulness_rating"),
        average_confidence_rating=Avg("confidence_rating"),
    )
    total_suggestions = PlanItem.objects.count()
    status_counts = get_suggestion_status_counts()

    return {
        "plan_count": plan_count,
        "feedback_count": feedback_count,
        "feedback_response_rate": percentage(feedback_count, plan_count),
        "average_helpfulness_rating": rounded_average(
            feedback_averages["average_helpfulness_rating"]
        ),
        "average_confidence_rating": rounded_average(
            feedback_averages["average_confidence_rating"]
        ),
        "total_suggestions": total_suggestions,
        "suggestion_status_counts": status_counts,
        "suggestion_action_rates": {
            "accepted": percentage(
                status_counts[PlanItem.Status.ACCEPTED], total_suggestions
            ),
            "snoozed": percentage(
                status_counts[PlanItem.Status.SNOOZED], total_suggestions
            ),
            "dismissed": percentage(
                status_counts[PlanItem.Status.DISMISSED], total_suggestions
            ),
        },
    }


@transaction.atomic
def rebuild_today_plan(user, target_date=None):
    target_date = target_date or today_for_user()
    check_in = get_or_create_check_in(user, target_date)
    now = timezone.now()
    plan, _ = TodayPlan.objects.get_or_create(
        user=user,
        date=target_date,
        defaults={"check_in": check_in, "generated_at": now},
    )
    plan.check_in = check_in
    plan.generated_at = now
    plan.status = TodayPlan.Status.ACTIVE
    plan.save(update_fields=["check_in", "generated_at", "status", "updated_at"])

    existing_items = {item.task_id: item for item in plan.items.select_related("task")}
    suggestions = rank_task_suggestions(user, check_in, plan, target_date)
    selected_task_ids = []

    for order, suggestion in enumerate(suggestions, start=1):
        selected_task_ids.append(suggestion.task.id)
        item = existing_items.get(suggestion.task.id)
        if item:
            item.order = order
            item.reason = suggestion.reason
            item.estimated_minutes = suggestion.estimated_minutes
            item.score = suggestion.score
            if (
                item.status == PlanItem.Status.SNOOZED
                and item.snoozed_until
                and item.snoozed_until <= now
            ):
                item.status = PlanItem.Status.SUGGESTED
                item.snoozed_until = None
            item.save(
                update_fields=[
                    "order",
                    "reason",
                    "estimated_minutes",
                    "score",
                    "status",
                    "snoozed_until",
                    "updated_at",
                ]
            )
            continue

        PlanItem.objects.create(
            plan=plan,
            task=suggestion.task,
            order=order,
            reason=suggestion.reason,
            estimated_minutes=suggestion.estimated_minutes,
            score=suggestion.score,
        )

    plan.items.filter(status=PlanItem.Status.SUGGESTED).exclude(
        task_id__in=selected_task_ids
    ).delete()
    return plan


def get_suggestion_status_counts():
    counts = {status: 0 for status, _ in PlanItem.Status.choices}
    status_rows = PlanItem.objects.values("status").annotate(count=Count("id"))
    for row in status_rows:
        counts[row["status"]] = row["count"]
    return counts


def rounded_average(value):
    return round(value, 2) if value is not None else None


def percentage(part, whole):
    return round((part / whole) * 100, 2) if whole else 0.0


def rank_task_suggestions(user, check_in, plan, target_date):
    now = timezone.now()
    candidates = (
        Task.objects.filter(
            section__project__created_by=user,
            completion_date__isnull=True,
        )
        .select_related("section__project")
        .order_by("order", "id")
    )
    existing_items = {item.task_id: item for item in plan.items.all()}

    suggestions = []
    for task in candidates:
        existing = existing_items.get(task.id)
        if existing and existing.status == PlanItem.Status.DISMISSED:
            continue
        if (
            existing
            and existing.status == PlanItem.Status.SNOOZED
            and existing.snoozed_until
            and existing.snoozed_until > now
        ):
            continue

        suggestion = score_task(task, check_in, target_date)
        suggestions.append(suggestion)

    suggestions.sort(
        key=lambda suggestion: (
            -suggestion.score,
            task_due_sort_key(suggestion.task),
            suggestion.task.order,
            suggestion.task.id,
        )
    )

    return fit_suggestions_to_available_time(suggestions, check_in.available_minutes)


def score_task(task, check_in, target_date):
    score = 0
    reasons = []
    due_date = task_due_date(task)
    priority = normalized_priority(task)

    if due_date and due_date < target_date:
        score += 100
        reasons.append("Overdue")
    elif due_date == target_date:
        score += 80
        reasons.append("Due today")
    elif due_date and due_date <= target_date + timedelta(days=7):
        score += 20
        reasons.append("Due soon")

    priority_score = {
        Task.Priority.HIGH: 30,
        Task.Priority.MEDIUM: 15,
        Task.Priority.LOW: 5,
        Task.Priority.NONE: 0,
    }[priority]
    if priority_score:
        score += priority_score
        reasons.append(f"{priority_label(priority)} priority")

    if task.rrule:
        score += 10
        reasons.append("Recurring")

    if check_in.focus_mode == EnergyCheckIn.FocusMode.DEEP and priority in {
        Task.Priority.HIGH,
        Task.Priority.MEDIUM,
    }:
        score += 8
        reasons.append("Good deep-work fit")
    elif check_in.focus_mode in {
        EnergyCheckIn.FocusMode.ADMIN,
        EnergyCheckIn.FocusMode.LIGHT,
    } and priority in {Task.Priority.LOW, Task.Priority.NONE}:
        score += 8
        reasons.append("Fits lighter work")

    if not reasons:
        score += 1
        reasons.append("Keeps backlog moving")

    return TaskSuggestion(
        task=task,
        score=score,
        reason=", ".join(reasons),
        estimated_minutes=estimate_task_minutes(task, check_in),
    )


def fit_suggestions_to_available_time(suggestions, available_minutes):
    selected = []
    used_minutes = 0

    for suggestion in suggestions:
        if len(selected) >= MAX_PLAN_ITEMS:
            break
        if (
            selected
            and available_minutes > 0
            and used_minutes + suggestion.estimated_minutes > available_minutes
        ):
            continue
        selected.append(suggestion)
        used_minutes += suggestion.estimated_minutes

    return selected


def estimate_task_minutes(task, check_in):
    priority = normalized_priority(task)
    if check_in.energy_level == EnergyCheckIn.EnergyLevel.LOW:
        return 25
    if priority == Task.Priority.HIGH:
        return 45
    if priority == Task.Priority.MEDIUM:
        return 35
    return 25


def normalized_priority(task):
    priority = LEGACY_PRIORITY_MAP.get(str(task.priority), task.priority)
    if priority not in Task.Priority.values:
        return Task.Priority.NONE
    return priority


def priority_label(priority):
    return {
        Task.Priority.HIGH: "High",
        Task.Priority.MEDIUM: "Medium",
        Task.Priority.LOW: "Low",
        Task.Priority.NONE: "None",
    }[priority]


def task_due_date(task):
    if not task.due_date:
        return None
    due_date = task.due_date
    if timezone.is_naive(due_date):
        due_date = timezone.make_aware(due_date)
    return timezone.localtime(due_date).date()


def task_due_sort_key(task):
    return task_due_date(task) or timezone.datetime.max.date()
