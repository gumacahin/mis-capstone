import {
  BooleanField,
  EditButton,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export default function AdminUserShow() {
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
        <TextField source="profile.name" label="Name" />
        <BooleanField source="profile.is_faculty" label="Is Faculty?" />
        <BooleanField source="profile.is_student" label="Is Student?" />
      </SimpleShowLayout>
    </Show>
  );
}
