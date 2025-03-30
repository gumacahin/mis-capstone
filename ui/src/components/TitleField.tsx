import Box, { BoxProps } from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { type Theme } from "@mui/material/styles";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BubbleMenu, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonBold,
  MenuButtonCode,
  MenuButtonItalic,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  RichTextContent,
  RichTextEditorProvider,
} from "mui-tiptap";
import { type Control, useController } from "react-hook-form";

import { NoNewLine, RemoveNewlinesOnPaste } from "../tiptap-extensions";
import { TaskFormFields } from "../types/common";
import MenuButtonEditLink from "./MenuButtonEditLink";

export interface TitleFieldProps extends BoxProps {
  control: Control<TaskFormFields>;
  onEnter: () => void;
}

const titleFieldStyles = {
  "& .tiptap.ProseMirror p ": {
    fontWeight: (theme: Theme) => {
      return theme.typography.fontWeightMedium;
    },
    fontSize: (theme: Theme) => {
      return theme.typography.h6.fontSize;
    },
  },
};

export default function TitleField({
  control,
  onEnter,
  ...rest
}: TitleFieldProps) {
  const { field: titleField } = useController({
    control,
    name: "title",
    rules: {
      required: true,
      validate: (value) => value.replace(/^(<p>)+|(<\/p>)+$/gi, "").length > 0,
    },
  });

  const titleEditor = useEditor({
    extensions: [
      StarterKit,
      LinkBubbleMenuHandler,
      Link,
      NoNewLine.configure({ onEnter }),
      RemoveNewlinesOnPaste,
      Placeholder.configure({ placeholder: "Task name" }),
    ],
    content: titleField.value,
    onUpdate: ({ editor }) => {
      titleField.onChange(editor.getHTML());
    },
  });

  return (
    <Box {...rest}>
      <RichTextEditorProvider editor={titleEditor}>
        {titleEditor && (
          <BubbleMenu editor={titleEditor}>
            <Paper onMouseDown={(event) => event.stopPropagation()}>
              <MenuControlsContainer>
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonStrikethrough />
                <MenuButtonCode />
                <MenuDivider />
                <MenuButtonEditLink />
              </MenuControlsContainer>
            </Paper>
          </BubbleMenu>
        )}
        <Box sx={titleFieldStyles}>
          <RichTextContent />
        </Box>
        <LinkBubbleMenu />
      </RichTextEditorProvider>
    </Box>
  );
}
