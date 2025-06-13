import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { StarterKit } from "@tiptap/starter-kit";
import {
  DefaultEditorOptions,
  FormatButtons,
  LinkButtons,
  RichTextInput,
  RichTextInputToolbar,
} from "ra-input-rich-text";
import { DateInput, Edit, ReferenceArrayInput, SimpleForm } from "react-admin";

import { NoNewLine, RemoveNewlinesOnPaste } from "../tiptap-extensions";

export default function AdminTaskEdit() {
  return (
    <Edit>
      <SimpleForm>
        <RichTextInput
          source="title"
          toolbar={
            <RichTextInputToolbar>
              <FormatButtons />
              <LinkButtons />
            </RichTextInputToolbar>
          }
          editorOptions={{
            ...DefaultEditorOptions,
            extensions: [
              StarterKit,
              Link,
              NoNewLine,
              RemoveNewlinesOnPaste,
              Placeholder.configure({ placeholder: "Task name" }),
            ],
          }}
        />
        <RichTextInput
          source="description"
          toolbar={
            <RichTextInputToolbar>
              <FormatButtons />
              <LinkButtons />
            </RichTextInputToolbar>
          }
          editorOptions={{
            ...DefaultEditorOptions,
            extensions: [
              StarterKit,
              Link,
              NoNewLine,
              RemoveNewlinesOnPaste,
              Placeholder.configure({ placeholder: "Description" }),
            ],
          }}
        />
        <DateInput source="due_date" label="Due Date" />
        <DateInput source="completion_date" label="Completion Date" />
        <ReferenceArrayInput source="tags" reference="tags" />
      </SimpleForm>
    </Edit>
  );
}
