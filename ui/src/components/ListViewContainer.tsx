import Stack, { type StackProps } from "@mui/material/Stack";
import { forwardRef, useState } from "react";

import { LIST_VIEW_MAX_WIDTH } from "../constants/ui";
import useScrollbarWidth from "../hooks/useScrollbarWidth";

const ListViewContainer = forwardRef<HTMLDivElement, StackProps>(
  (props: StackProps, ref) => {
    const { children, ...rest } = props;
    const [hideScrollbar, setHideScrollbar] = useState(true);
    const scrollbarWidth = useScrollbarWidth();
    const isScrollbarAutoHiding = scrollbarWidth === 0;

    const overflowY =
      isScrollbarAutoHiding || !hideScrollbar ? "auto" : "hidden";

    return (
      <Stack
        spacing={1}
        sx={{
          mx: "auto",
          overflowY,
          maxWidth: LIST_VIEW_MAX_WIDTH,
          height: "100%",
          flex: "0 0 auto",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          scrollbarGutter: "stable",
        }}
        onMouseEnter={() => setHideScrollbar(false)}
        onMouseLeave={() => setHideScrollbar(true)}
        {...rest}
        ref={ref}
      >
        {children}
      </Stack>
    );
  },
);

ListViewContainer.displayName = "ListViewContainer";
export default ListViewContainer;
