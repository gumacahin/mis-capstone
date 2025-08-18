import {
  DateField,
  EditButton,
  FunctionField,
  ReferenceArrayField,
  ReferenceField,
  RichTextField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export default function AdminTaskShow() {
  return (
    <Show
      actions={
        <>
          <EditButton />
        </>
      }
    >
      <SimpleShowLayout>
        <TextField source="id" />
        <RichTextField source="title" />
        <RichTextField source="description" emptyText="(No description)" />
        <DateField source="due_date" emptyText="(No due date)" />
        <DateField source="completion_date" emptyText="(Not completed)" />
        <FunctionField
          source="priority"
          render={(record) => record.priority.toLowerCase()}
        />
        <ReferenceArrayField
          reference="tags"
          source="tags"
          sortable={false}
          label="Tags"
        />
        <ReferenceField source="project" reference="projects" />
      </SimpleShowLayout>
    </Show>
  );
}
