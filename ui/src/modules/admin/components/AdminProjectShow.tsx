import {
  BooleanField,
  EditButton,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

export default function AdminProjectShow() {
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
        <BooleanField source="is_default" />
        <TextField source="title" />
        <TextField source="view" />
        <NumberField source="order" />
      </SimpleShowLayout>
    </Show>
  );
}
