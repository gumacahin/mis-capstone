from datetime import timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from upoutodo.models import (
    EnergyCheckIn,
    PlanItem,
    Project,
    ProjectSection,
    Task,
    TodayPlan,
    TodayPlanFeedback,
)
from upoutodo.services.planner import rebuild_today_plan, save_check_in

User = get_user_model()

DEMO_USERNAME = "planner-demo"
DEMO_EMAIL = "planner-demo@example.test"
DEMO_PASSWORD = "planner-demo-password"
DEMO_PROJECT_TITLE = "Capstone Evaluation Demo"


class Command(BaseCommand):
    help = "Seed a repeatable planner-first demo dataset for capstone evaluation."

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            default=DEMO_USERNAME,
            help=f"Demo username to create or update. Default: {DEMO_USERNAME}",
        )
        parser.add_argument(
            "--email",
            default=DEMO_EMAIL,
            help=f"Demo email to create or update. Default: {DEMO_EMAIL}",
        )
        parser.add_argument(
            "--password",
            default=DEMO_PASSWORD,
            help="Password assigned when the demo user is first created.",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Remove the existing demo project and today's planner records first.",
        )
        parser.add_argument(
            "--include-outcomes",
            action="store_true",
            help="Add sample suggestion actions and plan feedback for dashboard metrics.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        target_date = timezone.localdate()
        user = self._get_or_create_demo_user(
            username=options["username"],
            email=options["email"],
            password=options["password"],
        )

        if options["reset"]:
            self._reset_demo_data(user=user, target_date=target_date)

        project = self._get_or_create_project(user)
        sections = self._get_or_create_sections(project)
        tasks = self._upsert_demo_tasks(sections)

        check_in = save_check_in(
            user,
            {
                "energy_level": EnergyCheckIn.EnergyLevel.LOW,
                "available_minutes": 90,
                "focus_mode": EnergyCheckIn.FocusMode.LIGHT,
                "context": "Evaluation walkthrough: limited energy between meetings.",
            },
            target_date=target_date,
        )
        plan = rebuild_today_plan(user, target_date=target_date)

        if options["include_outcomes"]:
            self._add_sample_outcomes(user=user, plan=plan)
        else:
            self._clear_sample_outcomes(plan)

        suggestion_count = plan.items.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded planner evaluation demo for {user.username} "
                f"({user.email or options['email']})."
            )
        )
        self.stdout.write(f"Project: {project.title}")
        self.stdout.write(f"Tasks: {len(tasks)}")
        self.stdout.write(f"Today plan: {plan.id}")
        self.stdout.write(
            f"Check-in: {check_in.energy_level}, {check_in.available_minutes}m"
        )
        self.stdout.write(f"Suggestions: {suggestion_count}")

        if options["include_outcomes"]:
            self.stdout.write("Sample outcomes: included")
        else:
            self.stdout.write("Sample outcomes: not included")

        if user.username == DEMO_USERNAME:
            self.stdout.write(f"Demo username: {DEMO_USERNAME}")
            self.stdout.write(f"Demo password: {options['password']}")

    def _get_or_create_demo_user(self, username, email, password):
        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email, "is_active": True},
        )
        if created:
            user.set_password(password)
            user.save(update_fields=["password"])
        elif user.email != email:
            user.email = email
            user.save(update_fields=["email"])

        profile = user.profile
        profile.name = "Demo Faculty"
        profile.is_faculty = True
        profile.is_student = False
        profile.is_onboarded = True
        profile.save(update_fields=["name", "is_faculty", "is_student", "is_onboarded"])
        return user

    def _reset_demo_data(self, user, target_date):
        Project.objects.filter(created_by=user, title=DEMO_PROJECT_TITLE).delete()
        TodayPlan.objects.filter(user=user, date=target_date).delete()
        EnergyCheckIn.objects.filter(user=user, date=target_date).delete()

    def _get_or_create_project(self, user):
        project = Project.objects.filter(
            created_by=user, title=DEMO_PROJECT_TITLE
        ).first()
        if project:
            project.updated_by = user
            project.save(update_fields=["updated_by"])
            return project

        return Project.objects.create(
            title=DEMO_PROJECT_TITLE,
            created_by=user,
            updated_by=user,
            order=1,
        )

    def _get_or_create_sections(self, project):
        return {
            "teaching": self._get_or_create_section(project, "Teaching", 1),
            "admin": self._get_or_create_section(project, "Admin", 2),
            "research": self._get_or_create_section(project, "Research", 3),
        }

    def _get_or_create_section(self, project, title, order):
        section = ProjectSection.objects.filter(project=project, title=title).first()
        if section:
            section.order = order
            section.save(update_fields=["order"])
            return section

        return ProjectSection.objects.create(project=project, title=title, order=order)

    def _upsert_demo_tasks(self, sections):
        now = timezone.now()
        task_specs = [
            {
                "section": sections["teaching"],
                "title": "Grade overdue reflection submissions",
                "description": "A high-priority teaching task that should surface first.",
                "due_date": now - timedelta(days=1),
                "priority": Task.Priority.HIGH,
                "order": 1,
            },
            {
                "section": sections["teaching"],
                "title": "Finalize today's class announcement",
                "description": "A due-today teaching task for the main walkthrough.",
                "due_date": now,
                "priority": Task.Priority.MEDIUM,
                "order": 2,
            },
            {
                "section": sections["research"],
                "title": "Review thesis proposal comments",
                "description": "Near-term research work with high priority.",
                "due_date": now + timedelta(days=3),
                "priority": Task.Priority.HIGH,
                "order": 3,
            },
            {
                "section": sections["admin"],
                "title": "Reply to low-priority admin emails",
                "description": "Light administrative work for low-energy mode.",
                "due_date": now + timedelta(days=1),
                "priority": Task.Priority.LOW,
                "order": 4,
            },
            {
                "section": sections["admin"],
                "title": "Update weekly consultation slots",
                "description": "A recurring administrative planning task.",
                "due_date": now + timedelta(days=2),
                "priority": Task.Priority.LOW,
                "order": 5,
                "rrule": "FREQ=WEEKLY",
                "dtstart": now,
                "anchor_mode": Task.AnchorMode.SCHEDULED,
            },
            {
                "section": sections["research"],
                "title": "Draft adviser progress note",
                "description": "Backlog work that should rank below urgent tasks.",
                "due_date": None,
                "priority": Task.Priority.MEDIUM,
                "order": 6,
            },
        ]

        tasks = []
        for spec in task_specs:
            task = Task.objects.filter(
                section=spec["section"], title=spec["title"]
            ).first()
            values = {
                "description": spec["description"],
                "due_date": spec["due_date"],
                "priority": spec["priority"],
                "order": spec["order"],
                "completion_date": None,
                "rrule": spec.get("rrule", ""),
                "dtstart": spec.get("dtstart"),
                "anchor_mode": spec.get("anchor_mode", ""),
            }
            if task:
                for field, value in values.items():
                    setattr(task, field, value)
                task.save(update_fields=[*values.keys(), "updated_at"])
            else:
                task = Task.objects.create(
                    section=spec["section"], title=spec["title"], **values
                )
            tasks.append(task)
        return tasks

    def _add_sample_outcomes(self, user, plan):
        now = timezone.now()
        items = list(plan.items.order_by("order"))
        outcome_fields = ["status", "accepted_at", "snoozed_until", "dismissed_at"]

        if items:
            items[0].status = PlanItem.Status.ACCEPTED
            items[0].accepted_at = now
            items[0].snoozed_until = None
            items[0].dismissed_at = None
            items[0].save(update_fields=[*outcome_fields, "updated_at"])

        if len(items) > 1:
            items[1].status = PlanItem.Status.SNOOZED
            items[1].accepted_at = None
            items[1].snoozed_until = now + timedelta(hours=2)
            items[1].dismissed_at = None
            items[1].save(update_fields=[*outcome_fields, "updated_at"])

        if len(items) > 2:
            items[2].status = PlanItem.Status.DISMISSED
            items[2].accepted_at = None
            items[2].snoozed_until = None
            items[2].dismissed_at = now
            items[2].save(update_fields=[*outcome_fields, "updated_at"])

        TodayPlanFeedback.objects.update_or_create(
            user=user,
            plan=plan,
            defaults={
                "helpfulness_rating": 4,
                "confidence_rating": 4,
                "note": "Demo feedback: the next task was clear.",
            },
        )

    def _clear_sample_outcomes(self, plan):
        plan.items.update(
            status=PlanItem.Status.SUGGESTED,
            accepted_at=None,
            snoozed_until=None,
            dismissed_at=None,
        )
        TodayPlanFeedback.objects.filter(plan=plan).delete()
