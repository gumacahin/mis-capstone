import LinkIcon from "@mui/icons-material/Link";
import {
  MenuButton,
  type MenuButtonEditLinkProps,
  useRichTextEditorContext,
} from "mui-tiptap";
export default function MenuButtonEditLink(props: MenuButtonEditLinkProps) {
  // This is taken from https://github.com/sjdemartini/mui-tiptap/blob/main/src/controls/MenuButtonEditLink.tsx
  // Instead of using a ref to the menu button we use the editor view dom as the
  // anchor instead. This prevents the LinkBubbleMenu from being positioned incorrectly
  // when the bubble menu closes as the user interacts with the LinkBubbleMenu.
  const editor = useRichTextEditorContext();
  return (
    <MenuButton
      tooltipLabel="Link"
      tooltipShortcutKeys={["mod", "Shift", "U"]}
      IconComponent={LinkIcon}
      selected={editor?.isActive("link")}
      disabled={!editor?.isEditable}
      onClick={() =>
        editor?.commands.openLinkBubbleMenu({
          anchorEl: editor?.view.dom,
          placement: "bottom",
        })
      }
      {...props}
    />
  );
}
