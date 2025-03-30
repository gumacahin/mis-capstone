import Stack, { type StackProps } from "@mui/material/Stack";
import { forwardRef } from "react";

import useScrollbarWidth from "../hooks/useScrollbarWidth";

const BoardViewContainer = forwardRef<HTMLDivElement, StackProps>(
  (props: StackProps, ref) => {
    const { children, sx, ...rest } = props;
    const scrollbarWidth = useScrollbarWidth();
    const titleHeight = 32; // px
    return (
      <Stack
        direction="row"
        sx={{
          height: (theme) =>
            // The minus 8 here is to adjust the height so that the
            // scrollbar isn't clipped. This clipping happens in macOS.
            // TODO: Check in other OS if this is also the case.
            `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${scrollbarWidth - 8}px)`,
          overflowX: "auto",
          overflowY: "hidden",
          flex: "0 0 auto",
          alignItems: "start",
          justifyContent: "start",
          ...sx,
        }}
        {...rest}
        ref={ref}
      >
        {children}
      </Stack>
    );
  },
);

BoardViewContainer.displayName = "BoardViewContainer";
export default BoardViewContainer;
