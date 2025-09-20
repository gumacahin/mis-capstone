import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RepeatIcon from "@mui/icons-material/Repeat";
import {
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RRule } from "rrule";

import { useTasksDueOn } from "../hooks/useTasksDueOn";
import useTimezoneContext from "../hooks/useTimezoneContext";
import { TaskFormFields } from "../types/common";
import { type NLParserResult, parseNaturalLanguage } from "../utils";

export default function NaturalLanguageInput() {
  const timezone = useTimezoneContext();
  const [inputValue, setInputValue] = useState<string>("");
  const [parsedValue, setParsedValue] = useState<NLParserResult | null>(null);
  const { setValue } = useFormContext<TaskFormFields>();
  const isRepeating = parsedValue?.rrule !== null;

  // Fetch tasks for the start date
  const { data: tasks, isLoading: isLoadingTasks } = useTasksDueOn(
    parsedValue?.date?.tz(timezone) ?? null,
  );

  const handleClick = () => {
    setValue("dtstart", parsedValue!.date);
    setValue("rrule", parsedValue!.rrule);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    const parsingResult = parseNaturalLanguage(inputValue, timezone);
    setParsedValue(parsingResult);
  }, [inputValue, timezone]);

  // Format the display text based on the RRULE type
  const getDisplayText = (): string => {
    if (!parsedValue) return "";
    // Check if the RRULE has time components, not just the DTSTART time
    const hasTime =
      parsedValue.date &&
      parsedValue.date.tz(timezone).format("h:mm A") !== "12:00 AM";

    const rrule = parsedValue.rrule
      ? RRule.fromString(parsedValue.rrule)
      : null;
    const endDate = rrule?.origOptions.until
      ? dayjs.utc(rrule?.origOptions.until).tz(timezone)
      : null;

    if (!isRepeating) {
      // Non-repeating: show the date with time if provided
      if (hasTime) {
        return parsedValue.date.tz(timezone).format("ddd MMM D, h:mm A");
      } else {
        return parsedValue.date.tz(timezone).format("ddd MMM D");
      }
    }

    // Repeating: show start date -> end date or "Forever"
    const startText = parsedValue.date
      .tz(timezone)
      .format(hasTime ? "ddd MMM D, h:mm A" : "ddd MMM D");

    if (endDate) {
      // Has end date - format based on whether it's same month/year as start
      const startMonth = parsedValue.date.tz(timezone).month();
      const startYear = parsedValue.date.tz(timezone).year();
      const endMonth = endDate.tz(timezone).month();
      const endYear = endDate.tz(timezone).year();

      let endText = endDate.tz(timezone).format("ddd");

      // Add month if different month or year
      if (endMonth !== startMonth || endYear !== startYear) {
        endText += ` ${endDate.format("MMM")}`;
      }

      // Always add the day
      endText += ` ${endDate.tz(timezone).format("D")}`;

      // Add year if different from start year
      if (endYear !== startYear) {
        endText += ` ${endDate.tz(timezone).format("YYYY")}`;
      }

      return `${startText} → ${endText}`;
    } else {
      // No end date - show "Forever"
      return `${startText} → Forever`;
    }
  };

  const getIcon = () => {
    if (isRepeating) {
      return <RepeatIcon />;
    }
    return <CalendarTodayIcon />;
  };

  // Format the task count display
  const getTaskCountText = (): string => {
    if (isLoadingTasks) {
      return "Loading…";
    }

    const taskCount = tasks?.results?.length || 0;
    if (taskCount === 0) {
      return "No tasks";
    } else if (taskCount === 1) {
      return "1 task";
    } else {
      return `${taskCount} tasks`;
    }
  };

  return (
    <>
      <ListItem>
        <TextField
          onChange={handleChange}
          value={inputValue}
          fullWidth
          placeholder="Type a date…"
        />
      </ListItem>
      {parsedValue && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>{getIcon()}</ListItemIcon>
            <ListItemText
              primary={getDisplayText()}
              secondary={getTaskCountText()}
            />
          </ListItemButton>
        </ListItem>
      )}
      <Divider />
    </>
  );
}
