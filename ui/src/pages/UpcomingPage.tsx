import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Alert, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { MouseEvent, useState } from "react";

import { useTasks, useTasksToday } from "../api";
import AddTaskButton from "../components/AddTaskButton";
import RescheduleDialog from "../components/RescheduleDialog";
import SkeletonList from "../components/SkeletonList";
import TaskList from "../components/TaskList";
import type { ITask } from "../types/common";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

const getWeekDatesFromDate = (date: Date) => {
  const startOfWeek = dayjs(date).startOf("week");
  const today = dayjs();
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.add(i, "day");
    if (currentDate.isAfter(today, "day") || currentDate.isSame(today, "day")) {
      dates.push(currentDate.toDate());
    }
  }
  return dates;
};

function DatePager({
  selectedDate,
  handleDateSelect,
}: {
  selectedDate: Date;
  handleDateSelect: (date: Date) => void;
}) {
  const getStartOfNextWeek = (currentDate: Date) => {
    const currentDay = dayjs(currentDate);
    const startOfNextWeek = currentDay.add(1, "week").startOf("week");
    return startOfNextWeek.toDate();
  };

  const getStartOfPreviousWeek = (currentDate: Date) => {
    const currentDay = dayjs(currentDate);
    const startOfPreviousWeek = currentDay.subtract(1, "week").startOf("week");
    return startOfPreviousWeek.toDate();
  };

  const isDateInSelectedWeek = (selectedDate: Date) => {
    const startOfWeek = dayjs(selectedDate).startOf("week").add(1, "day"); // Start from Monday
    const endOfWeek = dayjs(selectedDate).endOf("week").add(1, "day"); // End on Sunday
    const givenDate = dayjs();

    return givenDate.isBetween(startOfWeek, endOfWeek, null, "[]");
  };
  return (
    <ButtonGroup variant="outlined" aria-label="calendar pager" size="small">
      <Button
        aria-label="previous"
        disabled={isDateInSelectedWeek(selectedDate)}
        onClick={() => {
          const startOfPreviousWeek = getStartOfPreviousWeek(selectedDate);
          handleDateSelect(startOfPreviousWeek);
        }}
      >
        <ChevronLeftIcon />
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          handleDateSelect(dayjs().toDate());
        }}
      >
        Today
      </Button>
      <Button
        aria-label="next"
        onClick={() => {
          const startOfNextWeek = getStartOfNextWeek(selectedDate);
          handleDateSelect(startOfNextWeek);
        }}
      >
        <ChevronRightIcon />
      </Button>
    </ButtonGroup>
  );
}

function CalendarDialog({
  handleDateSelect,
  selectedDate,
}: {
  handleDateSelect: (date: Date) => void;
  selectedDate: Date;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const id = open ? "calendar-popover" : undefined;

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        endIcon={<ArrowDropDownIcon />}
      >
        {dayjs(selectedDate).format("MMMM YYYY")}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            disablePast
            onChange={(date) => {
              handleDateSelect(date);
              handleClose();
            }}
            referenceDate={dayjs(selectedDate)}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
}

export default function UpcomingPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(dayjs().toDate());
  const weekDates = getWeekDatesFromDate(selectedDate);
  const { isPending, isError, data } = useTasks(
    weekDates[0],
    weekDates[weekDates.length - 1],
  );

  const { isError: tasksTodayIsError, data: tasksTodayData } = useTasksToday();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDayOfWeek = (date: Date) => {
    const givenDate = dayjs(date).startOf("day");
    const today = dayjs().startOf("day");
    const tomorrow = dayjs().add(1, "day").startOf("day");
    if (givenDate.isSame(today)) {
      return "Today";
    }
    if (givenDate.isSame(tomorrow)) {
      return "Tomorrow";
    }
    return dayjs(date).format("dddd");
  };

  const tasks: ITask[] = data?.results ?? [];
  const tasksToday: ITask[] = tasksTodayData?.results ?? [];
  const overdueTasks = tasksToday.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );

  return (
    <Box display={"flex"} flexDirection={"column"} height="100vh">
      <Box padding={3} flex="0 1 auto">
        <Typography my={3} variant={"h5"} component={"h2"}>
          Upcoming
        </Typography>
        <Box width="100%" display={"flex"} justifyContent={"space-between"}>
          <CalendarDialog
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
          />
          <DatePager
            selectedDate={selectedDate}
            handleDateSelect={handleDateSelect}
          />
        </Box>
      </Box>
      <Box
        sx={{
          flex: "1 1 auto",
          width: "100%",
          overflow: "auto",
          paddingX: 3,
        }}
      >
        <Stack direction="row" spacing={2}>
          {tasksTodayIsError && (
            <Alert severity="error">Failed to load tasks</Alert>
          )}
          {overdueTasks.length > 0 && (
            <Box minWidth={300}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={500} component={"h4"}>
                  Overdue
                </Typography>
                <RescheduleDialog tasks={overdueTasks} />
              </Box>
              <TaskList tasks={overdueTasks} />
            </Box>
          )}
          {weekDates.map((date, i) => (
            <Box minWidth={300} key={i}>
              <Typography fontWeight={500} component={"h4"}>
                {`${dayjs(date).format("MMM D")} ‧ ${formatDayOfWeek(date)}`}
              </Typography>
              {isPending ? (
                <SkeletonList count={5} width={250} />
              ) : isError ? (
                <Alert severity="error">Failed to load tasks</Alert>
              ) : (
                <>
                  <TaskList
                    hideDueDates
                    tasks={tasks.filter((task: ITask) =>
                      dayjs(task.due_date).isSame(dayjs(date)),
                    )}
                  />
                  <AddTaskButton dueDate={date} />
                </>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
