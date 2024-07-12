import { Typography } from "@mui/material"
import AddTodoFab from '../components/AddTodoFab';

export default function TodayPage() {
    return (
        <>
            <AddTodoFab />
            <Typography variant={'h4'} component={'h1'}>Today</Typography>
        </>
    )
}
