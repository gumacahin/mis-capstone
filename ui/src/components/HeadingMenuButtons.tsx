import { MenuButton, useRichTextEditorContext } from "mui-tiptap";

export default function HeadingMenuButtons() {
  const editor = useRichTextEditorContext();
  return (
    <>
      <MenuButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        tooltipLabel="Heading 1"
        tooltipShortcutKeys={["mod", "alt", "1"]}
        selected={editor?.isActive("heading", { level: 1 }) ?? false}
        disabled={!editor?.isEditable || !editor.can().toggleBold()}
      >
        H1
      </MenuButton>
      <MenuButton
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        tooltipLabel="Heading 2"
        tooltipShortcutKeys={["mod", "alt", "2"]}
        selected={editor?.isActive("heading", { level: 2 }) ?? false}
        disabled={!editor?.isEditable || !editor.can().toggleBold()}
      >
        H2
      </MenuButton>
    </>
  );
}
