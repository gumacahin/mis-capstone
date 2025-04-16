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
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import Portal from "@mui/material/Portal";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import relativeTime from "dayjs/plugin/relativeTime";
import { MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { useTasks, useTasksToday } from "../api";
import useScrollbarWidth from "../hooks/useScrollbarWidth";
import useToolbarContext from "../hooks/useToolbarContext";
import type { Task } from "../types/common";
import { formatDayOfWeek, getWeekDatesFromDate } from "../utils";
import AddTaskButton from "./AddTaskButton";
import InboxDefaultSectionProvider from "./InboxDefaultSectionProvider";
import OverdueTasks from "./OverdueTasks";
import SkeletonList from "./SkeletonList";
import TaskList from "./TaskList";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function UpcomingViewList() {
  const DATE_PAGER_HEIGHT = 48;
  const TOOLBAR_HEIGHT = 13;
  const scrollbarWidth = useScrollbarWidth();
  const today = dayjs();
  const [weekOffset, setWeekOffset] = useState(0);
  const [weekDates, setWeekDates] = useState<Dayjs[]>(
    getWeekDatesFromDate(dayjs()),
  );
  const [weekExtension, setWeekExtension] = useState(0);
  const [topCard, setTopCard] = useState<string | null>(null);

  const cards = useMemo(
    () => [
      "overdue",
      ...weekDates.map((date: Dayjs) => date.format("YYYY-MM-DD")),
    ],
    [weekDates],
  );
  const {
    isPending: isTasksPending,
    isError,
    data,
  } = useTasks(weekDates[0], weekDates[weekDates.length - 1]);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const stickyHeaderRef = useRef<HTMLDivElement | null>(null);
  const stickyHeaderOffset = 64;

  const {
    setToolbarHeight,
    setToolbarTitle,
    setToolbarSubtitle,
    setToolbarAdditionalIcons,
  } = useToolbarContext();

  const { isError: tasksTodayIsError, data: tasksTodayData } = useTasksToday();

  const handleDateSelect = (selectedDate: Dayjs) => {
    const today = dayjs();
    const weeksBetween = selectedDate.diff(today, "week");
    setWeekOffset(weeksBetween);
  };

  const handlePageWeek = (value: -1 | 0 | 1) => {
    if (value === 1) {
      setWeekOffset((prev) => prev + value);
      setWeekExtension((prev) => prev + value);
    } else if (value === 0) {
      setWeekOffset(0);
    } else {
      setWeekOffset((prev) => prev + value);
    }
  };

  const tasksToday: Task[] = useMemo(
    () => tasksTodayData?.results ?? [],
    [tasksTodayData],
  );
  const tasks: Task[] = data?.results ?? [];
  const overdueTasks = tasksToday.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );

  useEffect(() => {
    setToolbarHeight(TOOLBAR_HEIGHT);
  }, [setToolbarHeight]);

  useEffect(() => {
    const weekdates: Dayjs[] = getWeekDatesFromDate(today, weekExtension);
    setWeekDates(weekdates);
  }, [weekExtension, today]);

  useEffect(() => {
    const mainContentWrapper = document.querySelector(
      "#main-content-wrapper",
    ) as HTMLDivElement;
    const parent = mainContentWrapper.getBoundingClientRect();
    const handleScroll = () => {
      if (!refs.current) {
        return;
      }
      const found = Object.values(refs.current).find(
        (el: HTMLDivElement | null) => {
          const child = el?.getBoundingClientRect();
          if (!child) {
            return false;
          }
          if (
            child.top < parent.top + stickyHeaderOffset &&
            child.bottom > parent.top + stickyHeaderOffset
          ) {
            return true;
          }
        },
      );

      const clippingDataId = found?.getAttribute("data-id");
      if (clippingDataId) {
        setTopCard(clippingDataId);
      }

      if (mainContentWrapper.scrollTop <= 0) {
        setTopCard(null);
      }
    };

    mainContentWrapper?.addEventListener("scroll", handleScroll);

    return () => {
      mainContentWrapper?.removeEventListener("scroll", handleScroll);
    };
  }, [refs, setTopCard]);

  useEffect(() => {
    const restoreToolbar = () => {
      setToolbarTitle(
        <Typography variant={"h5"} component={"h2"} color="text.primary">
          Upcoming
        </Typography>,
      );
      setToolbarAdditionalIcons(null);
    };
    if (topCard) {
      setToolbarTitle(
        <Stack>
          <Typography
            sx={{
              textAlign: "center",
              color: "text.primary",
            }}
          >
            Upcoming
          </Typography>
          <CalendarDialog
            selectedDate={today}
            weekOffset={weekOffset}
            handleDateSelect={handleDateSelect}
          />
        </Stack>,
      );
      setToolbarAdditionalIcons(
        <WeekPager weekOffset={weekOffset} handlePageWeek={handlePageWeek} />,
      );
    } else {
      restoreToolbar();
    }
    return () => restoreToolbar();
  }, [
    today,
    setToolbarAdditionalIcons,
    setToolbarSubtitle,
    setToolbarTitle,
    topCard,
    weekOffset,
  ]);

  useEffect(() => {
    setToolbarSubtitle(
      <>
        <WeekDisplay
          selectedDate={dayjs(topCard).isValid() ? dayjs(topCard) : dayjs()}
          weekOffset={weekOffset}
        />
        <Divider />
      </>,
    );
    return () => setToolbarSubtitle(null);
  }, [setToolbarSubtitle, topCard, weekOffset]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const lastCard = cards[cards.length - 1];
        const lastCardVisible = entries.find(
          (entry) =>
            entry.isIntersecting &&
            entry.target.getAttribute("data-id") === lastCard,
        );
        if (lastCardVisible) {
          setWeekExtension((prev) => prev + 1);
        }
      },
      {
        root: document.querySelector("#main-content-wrapper"),
        rootMargin: `-${stickyHeaderOffset}px 0px 0px 0px`, // Adjust to your AppBar height
        // threshold: 0.1,
      },
    );

    cards.forEach((card) => {
      if (refs.current[card]) {
        observer.observe(refs.current[card]!);
      }
    });

    return () => observer.disconnect();
  }, [overdueTasks, cards, setToolbarTitle]);

  return (
    <InboxDefaultSectionProvider>
      {!topCard && (
        <Box
          px={2}
          pb={2}
          pt={{ xs: 0, sm: 2 }}
          width="100%"
          display={"flex"}
          justifyContent={"space-between"}
          maxWidth={800}
          mx="auto"
        >
          <CalendarDialog
            selectedDate={today}
            weekOffset={weekOffset}
            handleDateSelect={handleDateSelect}
          />
          <WeekPager weekOffset={weekOffset} handlePageWeek={handlePageWeek} />
        </Box>
      )}
      {topCard && (
        <Box
          sx={{
            position: "sticky",
            top: {
              xs: -5,
              sm: 0,
            },
            zIndex: 1,
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          <Box ref={stickyHeaderRef} />
          <Divider />
        </Box>
      )}
      <DragDropContext onDragEnd={() => {}}>
        <Stack
          direction="column"
          sx={{
            maxWidth: 800,
            mx: "auto",
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
            <OverdueTasks
              overdueTasks={overdueTasks}
              key={0}
              ref={(el: HTMLDivElement | null) => {
                if (el) {
                  refs.current["overdue"] = el;
                }
              }}
              headerRef={topCard === "overdue" ? stickyHeaderRef : null}
            />
          )}
          {weekDates.map((date) => {
            const cardHeader = (
              <CardHeader
                title={
                  <Typography fontWeight={500} component={"h4"}>
                    {`${dayjs(date).format("MMM D")} ‧ ${formatDayOfWeek(date)}`}
                  </Typography>
                }
              />
            );
            return (
              <Card
                sx={{ minWidth: 320 }}
                key={dayjs(date).format("YYYY-MM-DD")}
                elevation={0}
                ref={(el) => {
                  refs.current[dayjs(date).format("YYYY-MM-DD")] = el;
                }}
                data-id={date.format("YYYY-MM-DD")}
              >
                {topCard === date.format("YYYY-MM-DD") ? (
                  <Portal container={() => stickyHeaderRef.current || null}>
                    {cardHeader}
                  </Portal>
                ) : (
                  cardHeader
                )}
                {isTasksPending ? (
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
            );
          })}
        </Stack>
      </DragDropContext>
    </InboxDefaultSectionProvider>
  );
}

interface WeekDisplayProps {
  selectedDate: Dayjs;
  weekOffset: number;
}
function WeekDisplay({ selectedDate, weekOffset }: WeekDisplayProps) {
  const startOfWeek = dayjs(selectedDate)
    .startOf("week")
    .add(weekOffset, "week");
  const endOfWeek = startOfWeek.endOf("week");
  const weekDates = [];

  for (
    let date = startOfWeek;
    date.isBefore(endOfWeek);
    date = date.add(1, "day")
  ) {
    weekDates.push(date);
  }
  const scrollToDate = (date: Dayjs) => {
    const element = document.querySelector(
      `[data-id="${date.format("YYYY-MM-DD")}"]`,
    ) as HTMLDivElement;
    if (element) {
      element.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
      // This is to ensure that the sticky header is not covered by the AppBar.
      // Scrolling scrolls the parent for some reason.
      document
        .querySelector("#main-content-wrapper")!
        .parentElement!.scrollTo({ top: 0 });
    }
  };

  return (
    <Stack direction="row" mx="auto" mb={1}>
      {weekDates.map((date) => {
        const activeDate = dayjs(selectedDate).isSame(date, "day");
        const today = dayjs();
        return (
          <Button
            key={date.format("YYYY-MM-DD")}
            disabled={date.isBefore(today, "day")}
            size="small"
            variant={activeDate ? "outlined" : "text"}
            sx={{ textWrap: "nowrap" }}
            onClick={() => scrollToDate(date)}
          >
            {date.format("ddd D")}
          </Button>
        );
      })}
    </Stack>
  );
}

interface WeekPagerProps {
  handlePageWeek: (value: -1 | 0 | 1) => void;
  weekOffset: number;
}
function WeekPager({ handlePageWeek, weekOffset = 0 }: WeekPagerProps) {
  return (
    <ButtonGroup variant="outlined" aria-label="calendar pager" size="small">
      <Button
        size="small"
        aria-label="previous"
        disabled={weekOffset === 0}
        onClick={() => handlePageWeek(-1)}
      >
        <ChevronLeftIcon fontSize="small" />
      </Button>
      <Button size="small" variant="outlined" onClick={() => handlePageWeek(0)}>
        Today
      </Button>
      <Button size="small" aria-label="next" onClick={() => handlePageWeek(1)}>
        <ChevronRightIcon fontSize="small" />
      </Button>
    </ButtonGroup>
  );
}

interface CalendarDialogProps {
  weekOffset: number;
  handleDateSelect: (date: Dayjs) => void;
  selectedDate: Dayjs;
}
function CalendarDialog({
  handleDateSelect,
  weekOffset,
  selectedDate,
}: CalendarDialogProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const calendarValue = selectedDate.add(weekOffset, "week").startOf("week");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "calendar-popover" : undefined;
  const dateDisplay = dayjs().add(weekOffset, "week").startOf("week");

  return (
    <>
      <Button
        onClick={handleClick}
        size="small"
        endIcon={<ArrowDropDownIcon />}
        sx={{ textWrap: "nowrap" }}
      >
        {dateDisplay.format("MMMM YYYY")}
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
            referenceDate={calendarValue}
          />
        </LocalizationProvider>
      </Popover>
    </>
  );
}
