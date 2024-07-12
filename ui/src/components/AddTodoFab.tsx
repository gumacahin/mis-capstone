import { useState } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

export default function AddTodoFab() {
    const [open, setOpen] = useState<boolean>(false);


    return (
        <>
            <Fab sx={fabStyle} onClick={() => setOpen(true) } color="primary" aria-label="add">
                <AddIcon />
            </Fab>
            <Dialog open={open}
                    PaperProps={{
                        component: 'form',
                        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                          event.preventDefault();
                          const formData = new FormData(event.currentTarget);
                          const formJson = Object.fromEntries((formData as any).entries());
                          const email = formJson.email;
                          console.log(email);
                        //   handleClose();
                        },
                      }}
            >
                <DialogTitle>Add Task</DialogTitle>
                    <DialogContent>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Task name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        multiline
                        margin="dense"
                        id="desciption"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => setOpen(false) }>Cancel</Button>
                    <Button type="submit">Add Task</Button>
                    </DialogActions>
            </Dialog>

        </>
    )
}
