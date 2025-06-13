import {
  ChipField,
  Datagrid,
  List,
  ReferenceField,
  TextField,
} from "react-admin";

export default function AdminTagList() {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <ChipField source="name" />
        <ReferenceField source="created_by" reference="users" />
      </Datagrid>
    </List>
  );
}
