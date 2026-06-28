from dataclasses import dataclass
from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from upoutodo.models import PlanItem, TodayPlanFeedback
from upoutodo.services import planner as planner_service


class PlannerToolObjectNotFound(Exception):
    """Raised when a typed planner tool cannot access a requested object."""


@dataclass(frozen=True)
class PlannerToolDefinition:
    name: str
    description: str
    input_schema: dict
    mutates_state: bool


@dataclass(frozen=True)
class PlannerCheckInInput:
    energy_level: str | None = None
    available_minutes: int | None = None
    focus_mode: str | None = None
    context: str | None = None

    @classmethod
    def from_mapping(cls, data):
        return cls(
            energy_level=data.get("energy_level"),
            available_minutes=data.get("available_minutes"),
            focus_mode=data.get("focus_mode"),
            context=data.get("context"),
        )

    def to_update_data(self):
        return {
            key: value
            for key, value in {
                "energy_level": self.energy_level,
                "available_minutes": self.available_minutes,
                "focus_mode": self.focus_mode,
                "context": self.context,
            }.items()
            if value is not None
        }


@dataclass(frozen=True)
class PlannerFeedbackInput:
    helpfulness_rating: int
    confidence_rating: int
    note: str = ""

    @classmethod
    def from_mapping(cls, data):
        return cls(
            helpfulness_rating=data["helpfulness_rating"],
            confidence_rating=data["confidence_rating"],
            note=data.get("note", ""),
        )


PLANNER_TOOL_DEFINITIONS = (
    PlannerToolDefinition(
        name="get_today_plan",
        description="Return the current user's planner-first Today plan.",
        input_schema={"type": "object", "properties": {}, "required": []},
        mutates_state=False,
    ),
    PlannerToolDefinition(
        name="submit_check_in",
        description="Record energy, available time, focus mode, and context, then rebuild the Today plan.",
        input_schema={
            "type": "object",
            "properties": {
                "energy_level": {"type": "string", "enum": ["low", "medium", "high"]},
                "available_minutes": {"type": "integer", "minimum": 0, "maximum": 720},
                "focus_mode": {
                    "type": "string",
                    "enum": ["flexible", "deep", "admin", "light"],
                },
                "context": {"type": "string"},
            },
            "required": [],
        },
        mutates_state=True,
    ),
    PlannerToolDefinition(
        name="rebuild_today_plan",
        description="Regenerate the current user's Today plan from owned task data and check-in context.",
        input_schema={"type": "object", "properties": {}, "required": []},
        mutates_state=True,
    ),
    PlannerToolDefinition(
        name="accept_suggestion",
        description="Mark one of the current user's planner suggestions as accepted.",
        input_schema={
            "type": "object",
            "properties": {"suggestion_id": {"type": "integer"}},
            "required": ["suggestion_id"],
        },
        mutates_state=True,
    ),
    PlannerToolDefinition(
        name="snooze_suggestion",
        description="Snooze one of the current user's planner suggestions for a bounded number of minutes.",
        input_schema={
            "type": "object",
            "properties": {
                "suggestion_id": {"type": "integer"},
                "minutes": {"type": "integer", "minimum": 1, "maximum": 10080},
            },
            "required": ["suggestion_id", "minutes"],
        },
        mutates_state=True,
    ),
    PlannerToolDefinition(
        name="dismiss_suggestion",
        description="Dismiss one of the current user's planner suggestions without deleting the source task.",
        input_schema={
            "type": "object",
            "properties": {"suggestion_id": {"type": "integer"}},
            "required": ["suggestion_id"],
        },
        mutates_state=True,
    ),
    PlannerToolDefinition(
        name="submit_plan_feedback",
        description="Record aggregate-friendly feedback for the current user's Today plan.",
        input_schema={
            "type": "object",
            "properties": {
                "helpfulness_rating": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5,
                },
                "confidence_rating": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 5,
                },
                "note": {"type": "string", "maxLength": 1000},
            },
            "required": ["helpfulness_rating", "confidence_rating"],
        },
        mutates_state=True,
    ),
)


def get_planner_tool_definitions():
    return PLANNER_TOOL_DEFINITIONS


def get_today_plan(user):
    return planner_service.get_today_plan(user)


def submit_check_in(user, check_in_input):
    planner_service.save_check_in(user, check_in_input.to_update_data())
    return planner_service.rebuild_today_plan(user)


def rebuild_today_plan(user):
    return planner_service.rebuild_today_plan(user)


@transaction.atomic
def accept_suggestion(user, suggestion_id):
    item = get_plan_item_for_user(user, suggestion_id)
    item.status = PlanItem.Status.ACCEPTED
    item.accepted_at = timezone.now()
    item.snoozed_until = None
    item.save(update_fields=["status", "accepted_at", "snoozed_until", "updated_at"])
    return item


@transaction.atomic
def snooze_suggestion(user, suggestion_id, minutes):
    item = get_plan_item_for_user(user, suggestion_id)
    item.status = PlanItem.Status.SNOOZED
    item.snoozed_until = timezone.now() + timedelta(minutes=minutes)
    item.save(update_fields=["status", "snoozed_until", "updated_at"])
    return item


@transaction.atomic
def dismiss_suggestion(user, suggestion_id):
    item = get_plan_item_for_user(user, suggestion_id)
    item.status = PlanItem.Status.DISMISSED
    item.dismissed_at = timezone.now()
    item.snoozed_until = None
    item.save(update_fields=["status", "dismissed_at", "snoozed_until", "updated_at"])
    return item


@transaction.atomic
def submit_plan_feedback(user, feedback_input):
    plan = planner_service.get_today_plan(user)
    feedback, _ = TodayPlanFeedback.objects.update_or_create(
        plan=plan,
        defaults={
            "user": user,
            "helpfulness_rating": feedback_input.helpfulness_rating,
            "confidence_rating": feedback_input.confidence_rating,
            "note": feedback_input.note,
        },
    )
    return feedback


def get_plan_item_for_user(user, item_id):
    try:
        return PlanItem.objects.select_related("plan", "task").get(
            id=item_id,
            plan__user=user,
        )
    except (PlanItem.DoesNotExist, TypeError, ValueError) as exc:
        raise PlannerToolObjectNotFound("Planner suggestion not found.") from exc
