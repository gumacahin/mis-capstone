import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

type DatePickerProps = React.ComponentProps<typeof DatePicker>;

export default function DueDatePicker(props: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker format="YYYY-MM-DD" label="Due date" {...props} />
    </LocalizationProvider>
  );
}
