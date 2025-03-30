import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
export default function SkeletonList({
  count,
  width = 200,
}: {
  count: number;
  width?: number;
}) {
  return (
    <List>
      {Array.from({ length: count }).map((_, index) => (
        <ListItem key={index} disablePadding disableGutters>
          <ListItemIcon
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Skeleton variant="circular" width={15} height={15} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Skeleton variant="rectangular" width={width} height={15} />
            }
            secondary={
              <Box my={1}>
                <Skeleton
                  variant="rectangular"
                  width={width * 0.75}
                  height={15}
                />
              </Box>
            }
            primaryTypographyProps={{ component: "div" }}
            secondaryTypographyProps={{ component: "div" }}
          />
        </ListItem>
      ))}
    </List>
  );
}
