import { Divider, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import { Section } from "../types/common";
import AddProjectSectionForm from "./AddProjectSectionForm";

export default function ProjectSectionDivider({
  precedingSection,
  disabled = false,
}: {
  precedingSection: Section;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [shown, setShown] = useState<boolean>(false);
  const handleClose = () => {
    setOpen(false);
  };
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleOnMouseEnter = () => {
    clearTimeout(timeoutRef.current!);
    if (!disabled) {
      setShown(true);
    }
  };
  const handleOnMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShown(false);
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {open ? (
        <AddProjectSectionForm
          precedingSection={precedingSection}
          handleClose={handleClose}
        />
      ) : (
        <Divider
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
          onClick={() => {
            setShown(false);
            setOpen(true);
          }}
          sx={{
            position: "relative",
            cursor: "pointer",
            opacity: shown ? 1 : 0,
            transition: `opacity: ${shown ? "0.1s" : "0.3"} ease-in-out`,
          }}
          orientation="vertical"
          variant="middle"
          flexItem
        >
          <Typography
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              whiteSpace: "nowrap",
            }}
          >
            Add Section
          </Typography>
        </Divider>
      )}
    </>
  );
}
