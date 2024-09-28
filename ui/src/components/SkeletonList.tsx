import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
export default function SkeletonList({ length }: { length: number }) {
  return (
    <List>
      {Array.from({ length }).map((_, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <Skeleton variant="circular" width={15} height={15} />
          </ListItemIcon>
          <ListItemText
            primary={<Skeleton variant="rectangular" width={300} height={15} />}
            secondary={
              <Box my={1}>
                <Skeleton variant="rectangular" width={200} height={15} />
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
