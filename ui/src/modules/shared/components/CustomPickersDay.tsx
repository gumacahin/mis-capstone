import { styled } from "@mui/material/styles";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import { Dayjs } from "dayjs";

// Add the custom day component (you can place this before the DatePicker component)
const DashedBorderDay = styled(PickersDay)(({ theme }) => ({
  border: "2px dashed",
  borderColor: theme.palette.primary.main,
  borderRadius: "50%",
  "&:hover": {
    borderColor: theme.palette.primary.dark,
  },
}));

interface CustomPickersDayProps extends PickersDayProps<Dayjs> {
  highlightedDates?: Dayjs[];
}

export default function CustomPickersDay(props: CustomPickersDayProps) {
  const { day, highlightedDates = [], ...other } = props;

  const isHighlighted = highlightedDates.some((highlightedDate) =>
    day.isSame(highlightedDate, "day"),
  );

  if (isHighlighted) {
    return <DashedBorderDay {...other} day={day} />;
  }

  return <PickersDay {...other} day={day} />;
}
