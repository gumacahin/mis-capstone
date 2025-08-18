import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { StackProps } from "@mui/material/Stack/Stack";
import { TaskFormFields } from "@shared/types/common";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { BubbleMenu, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import {
  LinkBubbleMenu,
  LinkBubbleMenuHandler,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonStrikethrough,
  MenuControlsContainer,
  MenuDivider,
  RichTextContent,
  RichTextEditorProvider,
} from "mui-tiptap";
import { type Control, useController } from "react-hook-form";

import DescriptionIcon from "./DescriptionIcon";
import HeadingMenuButtons from "./HeadingMenuButtons";
import MenuButtonEditLink from "./MenuButtonEditLink";

export interface DescriptionFieldProps extends StackProps {
  control: Control<TaskFormFields>;
  hideDescriptionIcon?: boolean;
}

export default function DescriptionField({
  control,
  hideDescriptionIcon = false,
  ...rest
}: DescriptionFieldProps) {
  const { field: descriptionField } = useController({
    control,
    name: "description",
  });

  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      LinkBubbleMenuHandler,
      Link,
      Placeholder.configure({ placeholder: "Description" }),
    ],
    content: descriptionField.value,
    onUpdate: ({ editor }) => {
      descriptionField.onChange(editor.getHTML());
    },
  });

  return (
    <Stack direction="row" width={"100%"} {...rest}>
      {!hideDescriptionIcon && (
        <DescriptionIcon isVisible={descriptionEditor?.isEmpty} />
      )}
      <Box flexGrow={1}>
        <RichTextEditorProvider editor={descriptionEditor}>
          {descriptionEditor && (
            <BubbleMenu editor={descriptionEditor}>
              <Paper onMouseDown={(event) => event.stopPropagation()}>
                <MenuControlsContainer>
                  <MenuButtonBold />
                  <MenuButtonItalic />
                  <MenuButtonStrikethrough />
                  <HeadingMenuButtons />
                  <MenuButtonBlockquote />
                  <MenuButtonCode />
                  <MenuButtonBulletedList />
                  <MenuButtonOrderedList />
                  <MenuDivider />
                  <MenuButtonEditLink />
                </MenuControlsContainer>
              </Paper>
            </BubbleMenu>
          )}
          <RichTextContent />
          <LinkBubbleMenu />
        </RichTextEditorProvider>
      </Box>
    </Stack>
  );
}
