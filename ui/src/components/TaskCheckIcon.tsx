import IconButton from "@mui/material/IconButton";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import { Task } from "../types/common";
import { useUpdateTask } from "../api";
import pick from 'lodash.pick';

export default function TaskCheckIcon( {task}: {task: Task} ) {
    const mutation = useUpdateTask(task);

    const handleClick = () => {
        mutation.mutate(
            // TODO: Confirm this is the correct way to do this
            pick({ ...task, completed: !task.completed },
                ['title', 'completed']
            )
        )
    }

    return (
        <IconButton onClick={handleClick}>
            {task.completed
            ? <CheckCircleOutlineOutlinedIcon />
            : <CircleOutlinedIcon />}
        </IconButton>
    );
}
