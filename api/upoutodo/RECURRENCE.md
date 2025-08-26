# Recurring Tasks

UPOU Todo supports recurring tasks with natural language input, similar to Todoist's smart date parsing.

## Features

- **Natural Language Input**: Users can type recurrence patterns like "every weekday at 9am"
- **Automatic RRULE Generation**: Converts natural language to RFC 5545 RRULE format
- **Timezone Support**: Defaults to Asia/Manila timezone
- **Smart Completion**: Automatically advances to next occurrence when completed
- **Live Preview**: Shows next occurrence as user types

## Supported Patterns

### Basic Frequencies

- `every day`
- `every weekday` (Monday through Friday)
- `every weekend` (Saturday and Sunday)
- `every week`
- `every month`
- `every year`

### Intervals

- `every 2 weeks`
- `every 3 months`
- `every 2 years`

### Specific Days

- `every monday`
- `every tuesday at 5pm`
- `every friday at 9am`

### Ordinal Patterns

- `every 3rd friday`
- `every 1st monday`
- `every last day of month`

### Time Specifications

- `every weekday at 9am`
- `every monday at 5:30pm`
- `every day at 8:00`

### Start Dates

- `starting 2024-01-01 every weekday`
- `from January 1st every month`

## API Usage

### Creating a Recurring Task

```json
POST /api/tasks/
{
  "title": "Weekly Review",
  "section": 1,
  "recurrence": "every monday at 9am"
}
```

The API will automatically:

1. Parse the recurrence pattern
2. Generate the RRULE
3. Set `is_recurring` to `true`
4. Calculate the next occurrence
5. Set the `due_date` if not provided

### Task Completion

```json
POST /api/tasks/{id}/complete/
```

For recurring tasks, this will:

1. Mark the current instance as complete
2. Automatically advance to the next occurrence
3. Clear the completion date
4. Update the due date

### Recurrence Preview

```json
POST /api/recurrence/preview/
{
  "recurrence": "every 3rd friday at 2pm"
}
```

Returns:

```json
{
  "recurrence": "every 3rd friday at 2pm",
  "rrule": "FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3;BYHOUR=14;BYMINUTE=0;BYSECOND=0",
  "next_occurrence": "2024-01-19T14:00:00+08:00",
  "humanized": "Repeats every 3rd friday at 2pm"
}
```

## Database Schema

The Task model includes these recurrence fields:

- `is_recurring`: Boolean indicating if the task repeats
- `recurrence`: Natural language recurrence string
- `rrule`: RFC 5545 RRULE string
- `recurrence_anchor`: First occurrence datetime (UTC)
- `recurrence_timezone`: Timezone for calculations (default: Asia/Manila)
- `repeat_when_complete`: Whether to advance on completion (default: true)
- `parent_task`: Optional reference to template task for instance-per-occurrence mode

## Frontend Components

### RecurrenceField

A form field component that:

- Accepts natural language input
- Shows live preview of next occurrence
- Displays examples and validation errors
- Debounces API calls for performance

### TaskCard

Shows recurring task indicators:

- Repeat icon for recurring tasks
- Humanized recurrence description
- Next occurrence information

## Timezone Handling

All recurrence calculations use the Asia/Manila timezone by default:

- User input is interpreted in Manila time
- RRULE generation respects Manila time
- Database storage uses UTC
- Frontend displays in user's local timezone

## Examples

| Input                  | RRULE                                                             | Next Occurrence                   |
| ---------------------- | ----------------------------------------------------------------- | --------------------------------- |
| `every weekday at 9am` | `FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9;BYMINUTE=0;BYSECOND=0` | Next weekday at 9 AM Manila time  |
| `every 2 weeks`        | `FREQ=WEEKLY;INTERVAL=2`                                          | Every other Monday                |
| `every 3rd friday`     | `FREQ=MONTHLY;BYDAY=FR;BYSETPOS=3`                                | Third Friday of each month        |
| `every tuesday at 5pm` | `FREQ=WEEKLY;BYDAY=TU;BYHOUR=17;BYMINUTE=0;BYSECOND=0`            | Every Tuesday at 5 PM Manila time |

## Testing

Run the recurrence tests with pytest:

```bash
python -m pytest upoutodo/tests/test_recurrence.py -v
python -m pytest upoutodo/tests/models/test_task_recurrence.py -v
```

## Future Enhancements

- Instance-per-occurrence mode for historical tracking
- More sophisticated date parsing (e.g., "next week", "in 3 days")
- Calendar integration
- Email reminders for recurring tasks
- Bulk recurrence pattern updates
