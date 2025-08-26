"""
Recurrence utilities for UPOU Todo.

This module handles parsing natural language recurrence patterns into RFC 5545 RRULE format
and calculating next occurrences based on timezone-aware rules.
"""

import re
from datetime import datetime, timedelta
from typing import Optional, Tuple

import pytz
from dateutil.rrule import rrulestr


class RecurrenceParseError(Exception):
    """Raised when a recurrence pattern cannot be parsed."""

    pass


def parse_recurrence(natural: str, tz: str = "Asia/Manila") -> Tuple[str, datetime]:
    """
    Parse natural language recurrence into RRULE and anchor datetime.

    Args:
        natural: Natural language recurrence string (e.g., "every weekday at 9am")
        tz: Timezone string (defaults to Asia/Manila)

    Returns:
        Tuple of (rrule_string, anchor_datetime_in_utc)

    Raises:
        RecurrenceParseError: If the pattern cannot be parsed
    """
    if not natural or not natural.strip():
        raise RecurrenceParseError("Recurrence pattern cannot be empty")

    natural = natural.strip().lower()
    timezone = pytz.timezone(tz)

    # Extract time if present
    time_match = re.search(r"at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", natural)
    hour = 0
    minute = 0

    if time_match:
        hour = int(time_match.group(1))
        minute = int(time_match.group(2)) if time_match.group(2) else 0
        ampm = time_match.group(3)

        if ampm == "pm" and hour != 12:
            hour += 12
        elif ampm == "am" and hour == 12:
            hour = 0

        # Remove time from natural string for pattern matching
        natural = re.sub(r"\s+at\s+\d{1,2}(?::\d{2})?\s*(am|pm)?", "", natural)

    # Extract start date if present
    start_match = re.search(r"starting\s+(.+?)(?:\s|$)", natural)
    start_date = None
    if start_match:
        # Simple date parsing - in production you might want more sophisticated parsing
        start_text = start_match.group(1).strip()
        try:
            # Try to parse common date formats
            for fmt in ["%Y-%m-%d", "%m/%d/%Y", "%d/%m/%Y", "%B %d, %Y", "%b %d, %Y"]:
                try:
                    start_date = datetime.strptime(start_text, fmt)
                    break
                except ValueError:
                    continue

            if start_date:
                # Set time if specified, otherwise default to 9 AM
                if time_match:
                    start_date = start_date.replace(hour=hour, minute=minute)
                else:
                    start_date = start_date.replace(hour=9, minute=0)

                # Make timezone aware
                start_date = timezone.localize(start_date)
                natural = re.sub(r"starting\s+.+?(?:\s|$)", "", natural).strip()
        except Exception:
            # If date parsing fails, continue without start date
            pass

    # Parse frequency patterns
    if "every day" in natural:
        freq = "DAILY"
        interval = 1
    elif "every weekday" in natural:
        freq = "WEEKLY"
        interval = 1
        byday = "MO,TU,WE,TH,FR"
    elif "every weekend" in natural:
        freq = "WEEKLY"
        interval = 1
        byday = "SA,SU"
    elif "every week" in natural:
        freq = "WEEKLY"
        interval = 1
    elif "every 2 weeks" in natural or "every two weeks" in natural:
        freq = "WEEKLY"
        interval = 2
    elif "every 3 weeks" in natural or "every three weeks" in natural:
        freq = "WEEKLY"
        interval = 3
    elif "every month" in natural:
        freq = "MONTHLY"
        interval = 1
    elif "every 2 months" in natural or "every two months" in natural:
        freq = "MONTHLY"
        interval = 2
    elif "every 3 months" in natural or "every three months" in natural:
        freq = "MONTHLY"
        interval = 3
    elif "every year" in natural:
        freq = "YEARLY"
        interval = 1
    else:
        # Try to parse specific day patterns
        day_match = re.search(
            r"every\s+(mon|tue|tues|wed|thu|thurs|fri|sat|sun)", natural
        )
        if day_match:
            day_map = {
                "mon": "MO",
                "tue": "TU",
                "tues": "TU",
                "wed": "WE",
                "thu": "TH",
                "thurs": "TH",
                "fri": "FR",
                "sat": "SA",
                "sun": "SU",
            }
            day = day_map[day_match.group(1)]
            freq = "WEEKLY"
            interval = 1
            byday = day
        else:
            # Try to parse ordinal patterns like "every 3rd friday"
            ordinal_match = re.search(
                r"every\s+(\d+)(?:st|nd|rd|th)?\s+(mon|tue|tues|wed|thu|thurs|fri|sat|sun)",
                natural,
            )
            if ordinal_match:
                ordinal = int(ordinal_match.group(1))
                day_map = {
                    "mon": "MO",
                    "tue": "TU",
                    "tues": "TU",
                    "wed": "WE",
                    "thu": "TH",
                    "thurs": "TH",
                    "fri": "FR",
                    "sat": "SA",
                    "sun": "SU",
                }
                day = day_map[ordinal_match.group(2)]
                freq = "MONTHLY"
                interval = 1
                byday = day
                bysetpos = ordinal
            else:
                raise RecurrenceParseError(
                    f"Could not parse recurrence pattern: {natural}"
                )

    # Build RRULE
    rrule_parts = [f"FREQ={freq}"]

    if interval > 1:
        rrule_parts.append(f"INTERVAL={interval}")

    if "byday" in locals():
        rrule_parts.append(f"BYDAY={byday}")

    if "bysetpos" in locals():
        rrule_parts.append(f"BYSETPOS={bysetpos}")

    if time_match:
        rrule_parts.extend([f"BYHOUR={hour}", f"BYMINUTE={minute}", "BYSECOND=0"])

    rrule_str = ";".join(rrule_parts)

    # Calculate anchor datetime
    if start_date:
        anchor = start_date
    else:
        # Default to next occurrence from now
        now = timezone.localize(datetime.now())
        anchor = get_next_occurrence(now, rrule_str, tz)

    # Convert anchor to UTC for storage
    anchor_utc = anchor.astimezone(pytz.UTC)

    return rrule_str, anchor_utc


def get_next_occurrence(
    base_dt: datetime, rrule: str, tz: str, *, after: Optional[datetime] = None
) -> datetime:
    """
    Get the next occurrence based on an RRULE.

    Args:
        base_dt: Base datetime for the recurrence rule
        rrule: RRULE string
        tz: Timezone string
        after: Optional datetime to get occurrence after (defaults to now)

    Returns:
        Next occurrence as timezone-aware datetime
    """
    timezone = pytz.timezone(tz)

    if after is None:
        after = timezone.localize(datetime.now())
    elif after.tzinfo is None:
        after = timezone.localize(after)

    # Ensure base_dt is timezone aware
    if base_dt.tzinfo is None:
        base_dt = timezone.localize(base_dt)

    # Create RRULE object
    try:
        rule = rrulestr(rrule, dtstart=base_dt)
    except Exception as e:
        raise RecurrenceParseError(f"Invalid RRULE: {e}")

    # Get next occurrence
    next_occurrence = rule.after(after)

    if next_occurrence is None:
        # If no next occurrence, try to advance the base date
        # This handles edge cases like month-end issues
        advanced_base = base_dt + timedelta(days=30)
        rule = rrulestr(rrule, dtstart=advanced_base)
        next_occurrence = rule.after(after)

        if next_occurrence is None:
            raise RecurrenceParseError("Could not calculate next occurrence")

    # Ensure the result is timezone aware
    if next_occurrence.tzinfo is None:
        next_occurrence = timezone.localize(next_occurrence)

    return next_occurrence


def humanize_recurrence(rrule: str, tz: str = "Asia/Manila") -> str:
    """
    Convert RRULE back to human-readable format.

    Args:
        rrule: RRULE string
        tz: Timezone string

    Returns:
        Human-readable recurrence description
    """
    if not rrule:
        return ""

    try:
        # Parse RRULE parts
        parts = dict(part.split("=") for part in rrule.split(";") if "=" in part)

        freq = parts.get("FREQ", "")
        interval = int(parts.get("INTERVAL", "1"))
        byday = parts.get("BYDAY", "")
        bysetpos = parts.get("BYSETPOS", "")
        byhour = parts.get("BYHOUR", "")
        byminute = parts.get("BYMINUTE", "")

        # Build human-readable description
        description_parts = []

        if interval > 1:
            if freq == "WEEKLY":
                description_parts.append(f"every {interval} weeks")
            elif freq == "MONTHLY":
                description_parts.append(f"every {interval} months")
            elif freq == "YEARLY":
                description_parts.append(f"every {interval} years")
        else:
            if freq == "DAILY":
                description_parts.append("every day")
            elif freq == "WEEKLY":
                if byday:
                    if byday == "MO,TU,WE,TH,FR":
                        description_parts.append("every weekday")
                    elif byday == "SA,SU":
                        description_parts.append("every weekend")
                    else:
                        day_names = {
                            "MO": "Monday",
                            "TU": "Tuesday",
                            "WE": "Wednesday",
                            "TH": "Thursday",
                            "FR": "Friday",
                            "SA": "Saturday",
                            "SU": "Sunday",
                        }
                        days = [day_names.get(day, day) for day in byday.split(",")]
                        description_parts.append(f"every {', '.join(days)}")
                else:
                    description_parts.append("every week")
            elif freq == "MONTHLY":
                if byday and bysetpos:
                    day_names = {
                        "MO": "Monday",
                        "TU": "Tuesday",
                        "WE": "Wednesday",
                        "TH": "Thursday",
                        "FR": "Friday",
                        "SA": "Saturday",
                        "SU": "Sunday",
                    }
                    ordinal = {1: "1st", 2: "2nd", 3: "3rd", 4: "4th", -1: "last"}
                    day_name = day_names.get(byday, byday)
                    ordinal_text = ordinal.get(int(bysetpos), f"{bysetpos}th")
                    description_parts.append(f"every {ordinal_text} {day_name}")
                else:
                    description_parts.append("every month")
            elif freq == "YEARLY":
                description_parts.append("every year")

        # Add time if specified
        if byhour and byminute:
            hour = int(byhour)
            minute = int(byminute)

            if hour == 0:
                time_str = f"12:{minute:02d} AM"
            elif hour < 12:
                time_str = f"{hour}:{minute:02d} AM"
            elif hour == 12:
                time_str = f"12:{minute:02d} PM"
            else:
                time_str = f"{hour - 12}:{minute:02d} PM"

            description_parts.append(f"at {time_str}")

        return " ".join(description_parts)

    except Exception:
        # Fallback to showing the RRULE if parsing fails
        return f"Recurring ({rrule})"


def validate_recurrence(natural: str, tz: str = "Asia/Manila") -> bool:
    """
    Validate that a natural language recurrence pattern can be parsed.

    Args:
        natural: Natural language recurrence string
        tz: Timezone string

    Returns:
        True if valid, False otherwise
    """
    try:
        parse_recurrence(natural, tz)
        return True
    except RecurrenceParseError:
        return False
