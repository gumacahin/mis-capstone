import SortIcon from "@mui/icons-material/Sort";

export default function DescriptionIcon({
  isVisible = true,
}: {
  isVisible?: boolean;
}) {
  return isVisible ? (
    <SortIcon
      sx={{
        mr: 1,
        color: (theme) => theme.palette.grey[500],
      }}
    />
  ) : null;
}
