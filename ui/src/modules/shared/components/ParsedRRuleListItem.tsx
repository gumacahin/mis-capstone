import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useTasksForDate } from "../hooks/useTasksForDate";
import { useTimezone } from "../hooks/useTimezone";
import {
  isRecurring,
  parseRRuleEndDate,
  parseRRuleToDate,
} from "../utils/rrule";

interface ParsedRRuleListItemProps {
  rrule: string;
  onRRuleChange?: (rrule: string | null) => void;
}

export default function ParsedRRuleListItem({
  rrule,
  onRRuleChange,
}: ParsedRRuleListItemProps) {
  const { timezone } = useTimezone();

  // Parse the start date from the RRULE
  const startDate = parseRRuleToDate(rrule, timezone);
  const endDate = parseRRuleEndDate(rrule, timezone);
  const isRepeating = isRecurring(rrule);

  // Fetch tasks for the start date
  const { data: tasks, isLoading: isLoadingTasks } = useTasksForDate(startDate);

  if (!startDate) {
    return null;
  }

  const handleClick = () => {
    // If callback is provided, update the RRULE
    if (onRRuleChange) {
      onRRuleChange(rrule);
    }
  };

  // Check if the RRULE has time components (BYHOUR, BYMINUTE, BYSECOND)
  const hasTimeComponents = (): boolean => {
    try {
      // Extract only the RRULE part, not the DTSTART part
      const rruleMatch = rrule.match(/RRULE:(.+)/);
      let rruleOnly: string;

      if (rruleMatch) {
        // Has RRULE: prefix
        rruleOnly = rruleMatch[1];
      } else {
        // No RRULE: prefix, use the whole string
        rruleOnly = rrule;
      }

      // Check if the RRULE string explicitly contains time components
      const hasExplicitTime =
        rruleOnly.includes("BYHOUR=") ||
        rruleOnly.includes("BYMINUTE=") ||
        rruleOnly.includes("BYSECOND=");

      // For single occurrences (COUNT=1), also check if DTSTART has time
      if (!hasExplicitTime && rruleOnly.includes("COUNT=1")) {
        const dtstartMatch = rrule.match(/DTSTART:(\d{8}T\d{6}Z)/);
        if (dtstartMatch) {
          const dtstart = dtstartMatch[1];
          const hour = parseInt(dtstart.substring(9, 11));
          const minute = parseInt(dtstart.substring(11, 13));
          const second = parseInt(dtstart.substring(13, 15));
          // Consider it has time if not midnight
          return hour !== 0 || minute !== 0 || second !== 0;
        }
      }

      return hasExplicitTime;
    } catch {
      return false;
    }
  };

  // Format the display text based on the RRULE type
  const getDisplayText = (): string => {
    // Check if the RRULE has time components, not just the DTSTART time
    const hasTime = hasTimeComponents();

    if (!isRepeating) {
      // Non-repeating: show the date with time if provided
      if (hasTime) {
        return startDate.format("ddd MMM D, h:mm A");
      } else {
        return startDate.format("ddd MMM D");
      }
    }

    // Repeating: show start date -> end date or "Forever"
    let startText: string;
    if (hasTime) {
      startText = startDate.format("ddd MMM D, h:mm A");
    } else {
      startText = startDate.format("ddd MMM D");
    }

    if (endDate) {
      // Has end date - format based on whether it's same month/year as start
      const startMonth = startDate.month();
      const startYear = startDate.year();
      const endMonth = endDate.month();
      const endYear = endDate.year();

      let endText = endDate.format("ddd");

      // Add month if different month or year
      if (endMonth !== startMonth || endYear !== startYear) {
        endText += ` ${endDate.format("MMM")}`;
      }

      // Always add the day
      endText += ` ${endDate.format("D")}`;

      // Add year if different from start year
      if (endYear !== startYear) {
        endText += ` ${endDate.format("YYYY")}`;
      }

      return `${startText} → ${endText}`;
    } else {
      // No end date - show "Forever"
      return `${startText} → Forever`;
    }
  };

  const getIcon = () => {
    if (isRepeating) {
      return <RefreshIcon />;
    }
    return <CalendarTodayIcon />;
  };

  // Format the task count display
  const getTaskCountText = (): string => {
    if (isLoadingTasks) {
      return "Loading...";
    }

    const taskCount = tasks?.length || 0;
    if (taskCount === 0) {
      return "No tasks";
    } else if (taskCount === 1) {
      return "1 task";
    } else {
      return `${taskCount} tasks`;
    }
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={handleClick}>
        <ListItemIcon sx={{ minWidth: "auto", marginRight: 1 }}>
          {getIcon()}
        </ListItemIcon>
        <ListItemText
          primary={getDisplayText()}
          secondary={getTaskCountText()}
        />
      </ListItemButton>
    </ListItem>
  );
}
