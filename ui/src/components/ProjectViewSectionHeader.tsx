import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { ISection } from "../types/common";

export default function ProjectSectionHeader({
  section,
}: {
  section: ISection;
}) {
  return (
    <Box>
      <Box component={"header"}>
        <Typography fontWeight={600} variant="h3" fontSize={16}>
          {section.title}{" "}
          <Typography
            sx={{ display: "inline-block", marginLeft: 1 }}
            component={"span"}
            fontWeight="normal"
          >
            {section.tasks.length}
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
}
