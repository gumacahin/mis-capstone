from django.http import Http404
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from upoutodo.permissions import IsAdmin
from upoutodo.serializers.planner import (
    EnergyCheckInSerializer,
    PlanItemSerializer,
    PlannerEvaluationSummarySerializer,
    SnoozePlanItemSerializer,
    TodayPlanFeedbackSerializer,
    TodayPlanSerializer,
)
from upoutodo.services import planner_tools
from upoutodo.services.planner import get_planner_evaluation_summary
from upoutodo.services.planner_tools import (
    PlannerCheckInInput,
    PlannerFeedbackInput,
    PlannerToolObjectNotFound,
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
        plan = planner_tools.get_today_plan(request.user)
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
        plan = planner_tools.submit_check_in(
            request.user,
            PlannerCheckInInput.from_mapping(serializer.validated_data),
        )
        output_serializer = TodayPlanSerializer(
            plan, context=self.get_serializer_context()
        )
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(responses=TodayPlanSerializer)
    @action(detail=False, methods=["post"], url_path="rebuild")
    def rebuild(self, request):
        plan = planner_tools.rebuild_today_plan(request.user)
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
        feedback = planner_tools.submit_plan_feedback(
            request.user,
            PlannerFeedbackInput.from_mapping(serializer.validated_data),
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
        item = self.run_plan_item_tool(
            planner_tools.accept_suggestion,
            request.user,
            item_id,
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
        item = self.run_plan_item_tool(
            planner_tools.snooze_suggestion,
            request.user,
            item_id,
            serializer.validated_data["minutes"],
        )
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
        item = self.run_plan_item_tool(
            planner_tools.dismiss_suggestion,
            request.user,
            item_id,
        )
        serializer = PlanItemSerializer(item, context=self.get_serializer_context())
        return Response(serializer.data, status=status.HTTP_200_OK)

    def run_plan_item_tool(self, tool, user, item_id, *args):
        try:
            return tool(user, item_id, *args)
        except PlannerToolObjectNotFound as exc:
            raise Http404 from exc
