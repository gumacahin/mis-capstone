import Card, { type CardProps } from "@mui/material/Card";
import { forwardRef } from "react";

import { SECTION_CARD_WIDTH } from "../constants/ui";

const BoardProjectSectionCard = forwardRef<HTMLDivElement, CardProps>(
  (props: CardProps, ref) => {
    const { children, sx, ...rest } = props;
    return (
      <Card
        sx={{
          width: SECTION_CARD_WIDTH,
          height: "100%",
          overflowY: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: "0 0 auto",
          ...sx,
        }}
        {...rest}
        elevation={0}
        ref={ref}
      >
        {children}
      </Card>
    );
  },
);

BoardProjectSectionCard.displayName = "BoardProjectSectionCard";
export default BoardProjectSectionCard;
