import { DragDropContext } from "@hello-pangea/dnd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { MouseEvent, useState } from "react";

import { useTasks, useTasksToday } from "../api";
import useScrollbarWidth from "../hooks/useScrollbarWidth";
import type { Task } from "../types/common";
import { formatDayOfWeek, getWeekDatesFromDate } from "../utils";
import AddTaskButton from "./AddTaskButton";
import InboxDefaultSectionProvider from "./InboxDefaultSectionProvider";
import OverdueTasks from "./OverdueTasks";
import SkeletonList from "./SkeletonList";
import TaskList from "./TaskList";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function UpcomingViewBoard() {
  const DATE_PAGER_HEIGHT = 48;
  const scrollbarWidth = useScrollbarWidth();
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

  const tasks: Task[] = data?.results ?? [];
  const tasksToday: Task[] = tasksTodayData?.results ?? [];
  const overdueTasks = tasksToday.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );

  return (
    <InboxDefaultSectionProvider>
      <Box
        px={2}
        pb={2}
        width="100%"
        display={"flex"}
        justifyContent={"space-between"}
      >
        <CalendarDialog
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
        />
        <DatePager
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
        />
      </Box>
      <DragDropContext onDragEnd={() => {}}>
        <Stack
          direction="row"
          sx={{
            minHeight: (theme) =>
              `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${scrollbarWidth}px - ${DATE_PAGER_HEIGHT}px)`,
            overflowX: "auto",
            flex: "0 1 auto",
            // minWidth: 300,
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          {tasksTodayIsError && (
            <Card sx={{ minWidth: 320 }} elevation={0}>
              <CardContent>
                <Alert severity="error">Failed to load tasks</Alert>
              </CardContent>
            </Card>
          )}
          {overdueTasks.length > 0 && (
            <OverdueTasks overdueTasks={overdueTasks} />
          )}
          {weekDates.map((date, i) => (
            <Card sx={{ minWidth: 320 }} key={i} elevation={0}>
              <CardHeader
                title={
                  <Typography fontWeight={500} component={"h4"}>
                    {`${dayjs(date).format("MMM D")} ‧ ${formatDayOfWeek(date)}`}
                  </Typography>
                }
              />
              {isPending ? (
                <CardContent>
                  <SkeletonList count={5} width={180} />
                </CardContent>
              ) : isError ? (
                <CardContent>
                  <Alert severity="error">Failed to load tasks</Alert>
                </CardContent>
              ) : (
                <TaskList
                  hideDueDates
                  tasks={tasks.filter((task: Task) =>
                    dayjs(task.due_date).isSame(dayjs(date)),
                  )}
                />
              )}
              <CardActions>
                <AddTaskButton presetDueDate={dayjs(date)} />
              </CardActions>
            </Card>
          ))}
        </Stack>
      </DragDropContext>
    </InboxDefaultSectionProvider>
  );
}

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
