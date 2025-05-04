import Box from "@mui/material/Box";

export default function DescriptionIcon({
  isVisible = true,
}: {
  isVisible?: boolean;
}) {
  return (
    <Box
      color="GrayText"
      mr={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        width: "16px",
        height: "16px",
        display: isVisible ? "block" : "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="none"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path
          fill="currentColor"
          d="M8.5 12a.5.5 0 1 1 0 1h-5a.5.5 0 0 1 0-1h5Zm3.864-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 9H3.636C3.285 9 3 8.777 3 8.5c0-.245.225-.45.522-.491L3.636 8h8.728Zm0-4c.351 0 .636.224.636.5 0 .246-.225.45-.522.492L12.364 5H3.636C3.285 5 3 4.777 3 4.5c0-.245.225-.45.522-.491L3.636 4h8.728Z"
        ></path>
      </svg>
    </Box>
  );
}
