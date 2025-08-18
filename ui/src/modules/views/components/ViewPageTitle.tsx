import Typography from "@mui/material/Typography";

export type ViewPageTitleProps = {
  title: string;
};
export default function ViewPageTitle({ title }: ViewPageTitleProps) {
  return (
    <Typography variant="h5" component={"h2"} noWrap color="textPrimary">
      {title}
    </Typography>
  );
}
