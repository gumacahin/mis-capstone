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
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useTasks, useTasksToday } from "../api";
import { LIST_VIEW_MAX_WIDTH } from "../constants/ui";
import useToolbarContext from "../hooks/useToolbarContext";
import type { Task } from "../types/common";
import { getWeekDatesFromDate } from "../utils";
import AddTaskButton from "./AddTaskButton";
import InboxDefaultSectionProvider from "./InboxDefaultSectionProvider";
import ListOverdueTasks from "./ListOverdueTasks";
import ListProjectSectionCard from "./ListProjectSectionCard";
import ListTaskList from "./ListTaskList";
import ListViewContainer from "./ListViewContainer";
import SkeletonList from "./SkeletonList";

dayjs.extend(isBetween);
dayjs.extend(relativeTime);

export default function UpcomingViewList() {
  const [initialDataFetch, setInitialDataFetch] = useState(true);
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

  const { setToolbarTitle, setToolbarSubtitle, setToolbarAdditionalIcons } =
    useToolbarContext();

  const { isError: tasksTodayIsError, data: tasksTodayData } = useTasksToday();

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
        .querySelector("#list-view-container")!
        .parentElement!.scrollTo({ top: 0 });
    }
  };

  const handleDateSelect = useCallback((selectedDate: Dayjs) => {
    const today = dayjs();
    const weeksBetween = selectedDate.diff(today, "week");
    setWeekOffset(weeksBetween);
    setTimeout(() => {
      scrollToDate(selectedDate);
    }, 0);
  }, []);

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
  const tasks: Task[] = useMemo(() => data?.results ?? [], [data]);
  const overdueTasks = tasksToday.filter(
    (task) => task.due_date && dayjs(task.due_date).isBefore(dayjs(), "day"),
  );

  useEffect(() => {
    if (data?.results) {
      setInitialDataFetch(false);
    }
  }, [data]);

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
        root: document.querySelector("#list-view-container"),
        rootMargin: `-${stickyHeaderOffset}px 0px 0px 0px`,
      },
    );

    cards.forEach((card) => {
      if (refs.current[card]) {
        observer.observe(refs.current[card]!);
      }
    });

    return () => observer.disconnect();
  }, [overdueTasks, cards, setToolbarTitle]);

  useEffect(() => {
    const today = dayjs();
    const weekdates: Dayjs[] = getWeekDatesFromDate(today, weekExtension);
    setWeekDates(weekdates);
  }, [weekExtension]);

  useEffect(() => {
    setToolbarSubtitle(
      <>
        <WeekDisplay
          selectedDate={dayjs(topCard).isValid() ? dayjs(topCard) : dayjs()}
          weekOffset={weekOffset}
          scrollToDate={scrollToDate}
        />
        <Divider />
      </>,
    );
    return () => setToolbarSubtitle(null);
  }, [setToolbarSubtitle, topCard, weekOffset]);

  useEffect(() => {
    const mainContentWrapper = document.querySelector(
      "#list-view-container",
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
            // child.top < parent.top &&
            // child.bottom > parent.top
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
    const today = dayjs();
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
            topCard={topCard}
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
    setToolbarAdditionalIcons,
    setToolbarSubtitle,
    setToolbarTitle,
    topCard,
    weekOffset,
    handleDateSelect,
  ]);

  return (
    <InboxDefaultSectionProvider>
      <ListViewContainer id="list-view-container" mt={5}>
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
              width: "100%",
            }}
          >
            <Box ref={stickyHeaderRef} />
            <Divider />
          </Box>
        )}
        {!topCard && (
          <Box
            px={2}
            pb={2}
            pt={{ xs: 0, sm: 2 }}
            width="100%"
            display={"flex"}
            justifyContent={"space-between"}
            maxWidth={LIST_VIEW_MAX_WIDTH}
            mx="auto"
          >
            <CalendarDialog
              selectedDate={dayjs()}
              weekOffset={weekOffset}
              handleDateSelect={handleDateSelect}
              topCard={topCard}
            />
            <WeekPager
              weekOffset={weekOffset}
              handlePageWeek={handlePageWeek}
            />
          </Box>
        )}
        <DragDropContext onDragEnd={() => {}}>
          {tasksTodayIsError && (
            <Card sx={{ minWidth: 320 }} elevation={0}>
              <CardContent>
                <Alert severity="error">Failed to load tasks</Alert>
              </CardContent>
            </Card>
          )}
          {overdueTasks.length > 0 && (
            <ListOverdueTasks
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
            const isToday = date.isSame(dayjs(), "day");
            const cardTitle = `${date.format("MMM D")} ${isToday ? "‧ Today" : ""} ‧ ${date.format("dddd")}`;
            const cardHeader = (
              <CardHeader
                title={
                  <Typography
                    sx={{
                      textWrap: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    fontWeight={500}
                    fontSize={16}
                  >
                    {cardTitle}
                  </Typography>
                }
              />
            );
            return (
              <ListProjectSectionCard
                key={dayjs(date).format("YYYY-MM-DD")}
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
                {initialDataFetch && isTasksPending ? (
                  <CardContent>
                    <SkeletonList count={5} width={180} />
                  </CardContent>
                ) : isError ? (
                  <CardContent>
                    <Alert severity="error">Failed to load tasks</Alert>
                  </CardContent>
                ) : (
                  <ListTaskList
                    hideDueDates
                    tasks={tasks.filter((task: Task) =>
                      dayjs(task.due_date).isSame(dayjs(date)),
                    )}
                  />
                )}
                <CardActions>
                  <AddTaskButton presetDueDate={dayjs(date)} />
                </CardActions>
              </ListProjectSectionCard>
            );
          })}
        </DragDropContext>
      </ListViewContainer>
    </InboxDefaultSectionProvider>
  );
}

interface WeekDisplayProps {
  selectedDate: Dayjs;
  weekOffset: number;
  scrollToDate: (date: Dayjs) => void;
}
function WeekDisplay({
  selectedDate,
  scrollToDate,
  weekOffset,
}: WeekDisplayProps) {
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
  topCard: string | null;
}
function CalendarDialog({
  handleDateSelect,
  weekOffset,
  selectedDate,
  topCard,
}: CalendarDialogProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const topCardDate = dayjs(topCard);
  const calendarValueByWeekOffset = selectedDate
    .add(weekOffset, "week")
    .startOf("week");
  const calendarValue = topCardDate.isValid()
    ? topCardDate
    : calendarValueByWeekOffset;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "calendar-popover" : undefined;
  const dateDisplay = calendarValue;

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
