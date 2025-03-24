import Box from "@mui/material/Box";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Box px={2}>{children}</Box>;
}
