import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { render } from "@testing-library/react";
import dayjs from "dayjs";
import { describe, it } from "vitest";

import CustomPickersDay from "../CustomPickersDay";

describe("CustomPickersDay", () => {
  it("renders without crashing for an unhighlighted day", () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomPickersDay
          day={dayjs()}
          selected={false}
          onDaySelect={() => {}}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
          outsideCurrentMonth={false}
          highlightedDates={[]}
        />
      </LocalizationProvider>,
    );
    // no assertion needed: test passes if no error is thrown
  });

  it("renders without crashing for a highlighted day", () => {
    const today = dayjs();
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CustomPickersDay
          day={today}
          onDaySelect={() => {}}
          isFirstVisibleCell={false}
          isLastVisibleCell={false}
          selected={false}
          outsideCurrentMonth={false}
          highlightedDates={[today]}
        />
      </LocalizationProvider>,
    );
  });
});
