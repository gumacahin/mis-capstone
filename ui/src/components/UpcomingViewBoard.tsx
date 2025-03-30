import { DragDropContext, DraggableLocation } from "@hello-pangea/dnd";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Popover from "@mui/material/Popover";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { type Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { Fragment, MouseEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { DATE_PAGER_HEIGHT, TASK_CARD_WIDTH } from "../constants/ui";
import { useRescheduleTask, useTasks, useTasksToday } from "../hooks/queries";
import useScrollbarWidth from "../hooks/useScrollbarWidth";
import useToolbarContext from "../hooks/useToolbarContext";
import type { Task } from "../types/common";
import { getWeekDatesFromDate } from "../utils";
import BoardDateTasks from "./BoardDateTasks";
import BoardOverdueTasks from "./BoardOverdueTasks";
import BoardViewContainer from "./BoardViewContainer";
import InboxDefaultSectionProvider from "./InboxDefaultSectionProvider";
import SkeletonList from "./SkeletonList";
import ViewPageTitle from "./ViewPageTitle";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function UpcomingViewBoard() {
  const { setToolbarTitle } = useToolbarContext();
  const scrollbarWidth = useScrollbarWidth();
  const { mutateAsync: rescheduleTask } = useRescheduleTask();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const weekDates = getWeekDatesFromDate(selectedDate);
  const { isPending, isError, data } = useTasks(
    weekDates[0],
    weekDates[weekDates.length - 1],
  );
  const selectedWeekIncludesToday = dayjs(selectedDate).isSame(dayjs(), "week");

  const { isError: tasksTodayIsError, data: tasksTodayData } = useTasksToday();

  const tasks: Task[] = data?.results ?? [];
  const tasksToday: Task[] = tasksTodayData?.results ?? [];
  const overdueTasks = tasksToday.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );

  const handleDateSelect = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleDragEnd = async ({
    source,
    destination,
  }: {
    destination: DraggableLocation | null;
    source: DraggableLocation;
  }) => {
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId) {
      return;
    }
    const sourceDate = dayjs(source.droppableId.split("-")[1]);
    const sourceIsOverdue = source.droppableId === "overdue-tasks";
    const destinationDate = dayjs(destination.droppableId.split("-")[1]);

    if (!destinationDate.isValid()) {
      return;
    }

    const newSourceTaskList = Array.from(
      sourceIsOverdue
        ? overdueTasks
        : tasks.filter((task: Task) =>
            dayjs(task.due_date).isSame(sourceDate, "day"),
          ),
    );
    const newDestinationTaskList = Array.from(
      tasks.filter((task: Task) =>
        dayjs(task.due_date).isSame(destinationDate, "day"),
      ),
    );
    // TODO: Handle optimistic updates.
    const [task] = newSourceTaskList.splice(source.index, 1);
    newDestinationTaskList.splice(destination.index, 0, task);

    await toast.promise(
      rescheduleTask({
        task,
        dueDate: destinationDate,
      }),
      {
        loading: "Rescheduling task...",
        error: "Failed to reschedule task.",
        success: "Task rescheduled successfully!",
      },
    );
  };

  useEffect(() => {
    setToolbarTitle(<ViewPageTitle title="Upcoming" />);
    return () => {
      setToolbarTitle(null);
    };
  }, []);

  return (
    <InboxDefaultSectionProvider>
      <Box p={2} width="100%" display={"flex"} justifyContent={"space-between"}>
        <CalendarDialog
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
        />
        <DatePager
          selectedDate={selectedDate}
          handleDateSelect={handleDateSelect}
        />
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardViewContainer
          sx={{
            maxHeight: (theme) =>
              `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${scrollbarWidth}px - ${DATE_PAGER_HEIGHT}px)`,
          }}
        >
          {selectedWeekIncludesToday && tasksTodayIsError && (
            <Card sx={{ minWidth: TASK_CARD_WIDTH }} elevation={0}>
              <CardContent>
                <Alert severity="error">Failed to load tasks</Alert>
              </CardContent>
            </Card>
          )}
          {selectedWeekIncludesToday && overdueTasks.length > 0 && (
            <BoardOverdueTasks overdueTasks={overdueTasks} />
          )}
          {weekDates.map((date, i) => (
            <Fragment key={i}>
              {isPending ? (
                <Card sx={{ minWidth: TASK_CARD_WIDTH }} elevation={0}>
                  <CardContent>
                    <SkeletonList count={5} width={180} />
                  </CardContent>
                </Card>
              ) : isError ? (
                <Card sx={{ minWidth: TASK_CARD_WIDTH }} elevation={0}>
                  <CardContent>
                    <Alert severity="error">Failed to load tasks</Alert>
                  </CardContent>
                </Card>
              ) : (
                <BoardDateTasks
                  date={dayjs(date)}
                  hideDueDates
                  tasks={tasks.filter((task: Task) =>
                    dayjs(task.due_date).isSame(dayjs(date)),
                  )}
                />
              )}
            </Fragment>
          ))}
        </BoardViewContainer>
      </DragDropContext>
    </InboxDefaultSectionProvider>
  );
}

function DatePager({
  selectedDate,
  handleDateSelect,
}: {
  selectedDate: Dayjs;
  handleDateSelect: (date: Dayjs) => void;
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
  handleDateSelect: (date: Dayjs) => void;
  selectedDate: Dayjs;
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
