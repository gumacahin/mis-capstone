import {
  EditButton,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export default function AdminTagShow() {
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
        <TextField source="name" />
        <ReferenceField source="created_by" reference="users" />
      </SimpleShowLayout>
    </Show>
  );
}
