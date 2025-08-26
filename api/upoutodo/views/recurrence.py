"""
Recurrence preview views for UPOU Todo.
"""

from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from upoutodo.recurrence import RecurrenceParseError, parse_recurrence


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def preview_recurrence(request):
    """
    Preview the next occurrence for a given recurrence pattern.

    POST data:
    - recurrence: Natural language recurrence string
    - timezone: Optional timezone (defaults to Asia/Manila)
    """
    recurrence = request.data.get("recurrence", "").strip()
    timezone = request.data.get("timezone", "Asia/Manila")

    if not recurrence:
        return Response(
            {"error": "Recurrence pattern is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        rrule, anchor = parse_recurrence(recurrence, timezone)

        # Get the next occurrence
        from upoutodo.recurrence import get_next_occurrence

        next_occurrence = get_next_occurrence(anchor, rrule, timezone)

        return Response(
            {
                "recurrence": recurrence,
                "rrule": rrule,
                "anchor": anchor.isoformat(),
                "next_occurrence": next_occurrence.isoformat(),
                "humanized": f"Repeats {recurrence}",
                "timezone": timezone,
            }
        )

    except RecurrenceParseError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {"error": f"Unexpected error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
