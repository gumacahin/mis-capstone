"""
Tests for recurrence utilities.
"""

import pytest
import pytz
from django.utils import timezone

from upoutodo.recurrence import (
    RecurrenceParseError,
    get_next_occurrence,
    humanize_recurrence,
    parse_recurrence,
    validate_recurrence,
)


class TestRecurrenceParse:
    """Test recurrence pattern parsing."""

    def test_parse_every_weekday(self):
        """Test parsing 'every weekday' pattern."""
        rrule, anchor = parse_recurrence("every weekday")
        assert rrule == "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
        assert anchor is not None

    def test_parse_every_weekday_at_time(self):
        """Test parsing 'every weekday at 9am' pattern."""
        rrule, anchor = parse_recurrence("every weekday at 9am")
        assert (
            rrule == "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0;BYSECOND=0"
        )
        assert anchor is not None

    def test_parse_every_2_weeks(self):
        """Test parsing 'every 2 weeks' pattern."""
        rrule, anchor = parse_recurrence("every 2 weeks")
        assert rrule == "FREQ=WEEKLY;INTERVAL=2"
        assert anchor is not None

    def test_parse_every_3rd_friday(self):
        """Test parsing 'every 3rd friday' pattern."""
        rrule, anchor = parse_recurrence("every 3rd friday")
        assert rrule == "FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3"
        assert anchor is not None

    def test_parse_every_tuesday_at_5pm(self):
        """Test parsing 'every tuesday at 5pm' pattern."""
        rrule, anchor = parse_recurrence("every tuesday at 5pm")
        assert rrule == "FREQ=WEEKLY;BYDAY=TU;BYHOUR=17;BYMINUTE=0;BYSECOND=0"
        assert anchor is not None

    def test_parse_invalid_pattern(self):
        """Test that invalid patterns raise RecurrenceParseError."""
        with pytest.raises(RecurrenceParseError):
            parse_recurrence("invalid pattern")

    def test_parse_empty_pattern(self):
        """Test that empty patterns raise RecurrenceParseError."""
        with pytest.raises(RecurrenceParseError):
            parse_recurrence("")


class TestRecurrenceNextOccurrence:
    """Test next occurrence calculation."""

    def test_get_next_occurrence_weekly(self):
        """Test getting next occurrence for weekly pattern."""
        base_dt = timezone.now().replace(hour=9, minute=0, second=0, microsecond=0)
        rrule = "FREQ=WEEKLY;BYDAY=MO;BYHOUR=9;BYMINUTE=0;BYSECOND=0"

        next_occurrence = get_next_occurrence(base_dt, rrule, "Asia/Manila")
        assert next_occurrence is not None
        assert next_occurrence.weekday() == 0  # Monday

    def test_get_next_occurrence_monthly(self):
        """Test getting next occurrence for monthly pattern."""
        base_dt = timezone.now().replace(hour=9, minute=0, second=0, microsecond=0)
        rrule = "FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3;BYHOUR=9;BYMINUTE=0;BYSECOND=0"

        next_occurrence = get_next_occurrence(base_dt, rrule, "Asia/Manila")
        assert next_occurrence is not None
        assert next_occurrence.weekday() == 4  # Friday


class TestRecurrenceHumanize:
    """Test humanizing RRULE strings."""

    def test_humanize_weekly(self):
        """Test humanizing weekly RRULE."""
        rrule = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"
        humanized = humanize_recurrence(rrule)
        assert humanized == "every weekday"

    def test_humanize_weekly_with_time(self):
        """Test humanizing weekly RRULE with time."""
        rrule = "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0;BYSECOND=0"
        humanized = humanize_recurrence(rrule)
        assert humanized == "every weekday at 9:00 AM"

    def test_humanize_monthly_ordinal(self):
        """Test humanizing monthly RRULE with ordinal."""
        rrule = "FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3"
        humanized = humanize_recurrence(rrule)
        assert humanized == "every 3rd Friday"

    def test_humanize_interval(self):
        """Test humanizing RRULE with interval."""
        rrule = "FREQ=WEEKLY;INTERVAL=2"
        humanized = humanize_recurrence(rrule)
        assert humanized == "every 2 weeks"


class TestRecurrenceValidation:
    """Test recurrence validation."""

    def test_validate_valid_patterns(self):
        """Test validation of valid patterns."""
        valid_patterns = [
            "every weekday",
            "every 2 weeks",
            "every 3rd friday",
            "every tuesday at 5pm",
        ]

        for pattern in valid_patterns:
            assert validate_recurrence(pattern)

    def test_validate_invalid_patterns(self):
        """Test validation of invalid patterns."""
        invalid_patterns = [
            "",
            "invalid pattern",
            "every invalid day",
        ]

        for pattern in invalid_patterns:
            assert not validate_recurrence(pattern)


class TestRecurrenceTimezone:
    """Test timezone handling."""

    def test_manila_timezone_default(self):
        """Test that Asia/Manila is the default timezone."""
        rrule, anchor = parse_recurrence("every weekday at 9am")

        # The anchor should be in UTC for storage
        assert anchor.tzinfo == pytz.UTC

        # Test that we can get a next occurrence
        next_occurrence = get_next_occurrence(anchor, rrule, "Asia/Manila")
        assert next_occurrence is not None

        # Test that the RRULE contains the expected time components
        assert "BYHOUR=9" in rrule
        assert "BYMINUTE=0" in rrule
