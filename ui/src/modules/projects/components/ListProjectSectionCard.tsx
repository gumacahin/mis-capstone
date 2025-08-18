import Card, { type CardProps } from "@mui/material/Card";
import { forwardRef } from "react";

const ListProjectSectionCard = forwardRef<HTMLDivElement, CardProps>(
  (props: CardProps, ref) => {
    const { children, sx, ...rest } = props;
    return (
      <Card
        sx={{
          width: "100%",
          height: "auto",
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

ListProjectSectionCard.displayName = "ListProjectSectionCard";
export default ListProjectSectionCard;
