import { BooleanField, Datagrid, List, TextField } from "react-admin";

export default function AdminUserList() {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="profile.name" label="Name" />
        <BooleanField source="profile.is_faculty" label="Is Faculty" />
        <BooleanField source="profile.is_student" label="Is Student" />
      </Datagrid>
    </List>
  );
}
