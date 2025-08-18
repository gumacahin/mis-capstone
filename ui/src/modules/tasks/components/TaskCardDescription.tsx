import Typography from "@mui/material/Typography";
import { Task } from "@shared/types/common";
import { useEffect, useRef } from "react";

export interface TaskCardDescriptionProps {
  task: Task;
}

export default function TaskCardDescription({
  task,
}: TaskCardDescriptionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      const element = ref.current;

      // Get the computed line height of the element
      const lineHeight = parseInt(
        window.getComputedStyle(element).lineHeight,
        10,
      );

      // Check if the content exceeds one line
      if (element.scrollHeight > lineHeight) {
        // Truncate the text to fit within one line
        const words = element.textContent!.split(" ");
        let truncatedText = "";

        for (let i = 0; i < words.length; i++) {
          truncatedText += words[i] + " ";
          element.textContent = truncatedText.trim() + "…";

          // Stop adding words if the content fits within one line
          if (element.scrollHeight <= lineHeight) {
            break;
          }
        }
      }
    }
  }, [task.description]);

  return (
    <Typography
      ref={ref}
      sx={{
        textWrap: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        textDecoration: task.completion_date ? "line-through" : "default",
        "& p": {
          margin: 0,
          textOverflow: "ellipsis",
          overflow: "hidden",
        },
        fontSize: (theme) => theme.typography.body2.fontSize,
      }}
      dangerouslySetInnerHTML={{
        __html: task.description!,
      }}
    />
  );
}
