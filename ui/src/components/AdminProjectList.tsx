import {
  BooleanField,
  Datagrid,
  List,
  ReferenceField,
  TextField,
} from "react-admin";

export default function AdminProjectList() {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="title" />
        <BooleanField source="is_default" />
        <TextField source="view" />
        <ReferenceField source="created_by" reference="users" link="show" />
      </Datagrid>
    </List>
  );
}
