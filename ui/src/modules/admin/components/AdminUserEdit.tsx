import { BooleanInput, Edit, SimpleForm, TextInput } from "react-admin";

export default function AdminUserEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="profile.name" />
        <BooleanInput source="profile.is_faculty" label="Is Faculty?" />
        <BooleanInput source="profile.is_student" label="Is Student?" />
      </SimpleForm>
    </Edit>
  );
}
