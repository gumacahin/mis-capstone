import Box from "@mui/material/Box";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box p={2}>{children}</Box>;
}
