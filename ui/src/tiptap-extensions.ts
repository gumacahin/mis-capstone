import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";

// @link https://github.com/ueberdosis/tiptap/issues/313#issuecomment-1277897635
export const NoNewLine = Extension.create({
  name: "no_new_line",

  addOptions() {
    return {
      onEnter: () => undefined,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("eventHandler"),
        props: {
          handleKeyDown: (_, event) => {
            if (event.key === "Enter") {
              this.options.onEnter();
              return true;
            }
          },
        },
      }),
    ];
  },
});

export const RemoveNewlinesOnPaste = Extension.create({
  name: "remove_newlines_on_paste",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("removeNewlinesOnPaste"),
        props: {
          handlePaste(view, event) {
            if (event.clipboardData) {
              // Get the pasted text
              const text = event.clipboardData.getData("text/plain");

              // Remove newlines from the pasted text
              const sanitizedText = text.replace(/\r?\n|\r/g, " ");

              // Prevent the default paste behavior
              event.preventDefault();

              // Insert the sanitized text into the editor
              const { state, dispatch } = view;
              const { tr } = state;
              dispatch(
                tr.insertText(
                  sanitizedText,
                  state.selection.from,
                  state.selection.to,
                ),
              );

              return true; // Indicate that the paste event was handled
            }
            return false; // Allow default behavior for other cases
          },
        },
      }),
    ];
  },
});
