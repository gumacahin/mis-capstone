import { Edit, SimpleForm, TextInput } from "react-admin";

export default function AdminTagEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" />
      </SimpleForm>
    </Edit>
  );
}
