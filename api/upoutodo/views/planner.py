from datetime import timedelta

from django.shortcuts import get_object_or_404
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from upoutodo.models import PlanItem, TodayPlanFeedback
from upoutodo.permissions import IsAdmin
from upoutodo.serializers.planner import (
    EnergyCheckInSerializer,
    PlanItemSerializer,
    PlannerEvaluationSummarySerializer,
    SnoozePlanItemSerializer,
    TodayPlanFeedbackSerializer,
    TodayPlanSerializer,
)
from upoutodo.services.planner import (
    get_planner_evaluation_summary,
    get_today_plan,
    rebuild_today_plan,
    save_check_in,
)


class PlannerViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = TodayPlanSerializer

    def get_permissions(self):
        permission_classes = [permissions.IsAuthenticated]
        if getattr(self, "action", None) == "evaluation":
            permission_classes.append(IsAdmin)
        return [permission() for permission in permission_classes]

    def get_serializer_context(self):
        return {"request": self.request}

    @extend_schema(responses=TodayPlanSerializer)
    @action(detail=False, methods=["get"], url_path="today")
    def today(self, request):
        plan = get_today_plan(request.user)
        serializer = TodayPlanSerializer(plan, context=self.get_serializer_context())
        return Response(serializer.data)

    @extend_schema(
        request=EnergyCheckInSerializer,
        responses=TodayPlanSerializer,
    )
    @action(detail=False, methods=["post"], url_path="check-in")
    def check_in(self, request):
        serializer = EnergyCheckInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        save_check_in(request.user, serializer.validated_data)
        plan = rebuild_today_plan(request.user)
        output_serializer = TodayPlanSerializer(
            plan, context=self.get_serializer_context()
        )
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=TodayPlanSerializer)
    @action(detail=False, methods=["post"], url_path="rebuild")
    def rebuild(self, request):
        plan = rebuild_today_plan(request.user)
        serializer = TodayPlanSerializer(plan, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=TodayPlanFeedbackSerializer,
        responses=TodayPlanFeedbackSerializer,
    )
    @action(detail=False, methods=["post"], url_path="feedback")
    def feedback(self, request):
        serializer = TodayPlanFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = get_today_plan(request.user)
        feedback, _ = TodayPlanFeedback.objects.update_or_create(
            plan=plan,
            defaults={
                "user": request.user,
                **serializer.validated_data,
            },
        )
        output_serializer = TodayPlanFeedbackSerializer(feedback)
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=PlannerEvaluationSummarySerializer)
    @action(detail=False, methods=["get"], url_path="evaluation")
    def evaluation(self, request):
        serializer = PlannerEvaluationSummarySerializer(
            get_planner_evaluation_summary()
        )
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter("item_id", OpenApiTypes.INT, OpenApiParameter.PATH)
        ],
        responses=PlanItemSerializer,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path=r"suggestions/(?P<item_id>[^/.]+)/accept",
    )
    def accept_suggestion(self, request, item_id=None):
        item = self.get_plan_item(request, item_id)
        item.status = PlanItem.Status.ACCEPTED
        item.accepted_at = timezone.now()
        item.snoozed_until = None
        item.save(
            update_fields=["status", "accepted_at", "snoozed_until", "updated_at"]
        )
        serializer = PlanItemSerializer(item, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter("item_id", OpenApiTypes.INT, OpenApiParameter.PATH)
        ],
        request=SnoozePlanItemSerializer,
        responses=PlanItemSerializer,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path=r"suggestions/(?P<item_id>[^/.]+)/snooze",
    )
    def snooze_suggestion(self, request, item_id=None):
        serializer = SnoozePlanItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item = self.get_plan_item(request, item_id)
        item.status = PlanItem.Status.SNOOZED
        item.snoozed_until = timezone.now() + timedelta(
            minutes=serializer.validated_data["minutes"]
        )
        item.save(update_fields=["status", "snoozed_until", "updated_at"])
        output_serializer = PlanItemSerializer(
            item, context=self.get_serializer_context()
        )
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        parameters=[
            OpenApiParameter("item_id", OpenApiTypes.INT, OpenApiParameter.PATH)
        ],
        responses=PlanItemSerializer,
    )
    @action(
        detail=False,
        methods=["post"],
        url_path=r"suggestions/(?P<item_id>[^/.]+)/dismiss",
    )
    def dismiss_suggestion(self, request, item_id=None):
        item = self.get_plan_item(request, item_id)
        item.status = PlanItem.Status.DISMISSED
        item.dismissed_at = timezone.now()
        item.snoozed_until = None
        item.save(
            update_fields=["status", "dismissed_at", "snoozed_until", "updated_at"]
        )
        serializer = PlanItemSerializer(item, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def get_plan_item(self, request, item_id):
        return get_object_or_404(PlanItem, id=item_id, plan__user=request.user)
