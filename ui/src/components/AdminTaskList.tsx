import Typography from "@mui/material/Typography";
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  ReferenceArrayField,
  ReferenceField,
  TextField,
  TextInput,
} from "react-admin";
import striptags from "striptags";

import { Task } from "../types/common";
import PriorityIcon from "./PriorityIcon";

const postFilters = [
  <TextInput source="q" label="Search" alwaysOn key="search" />,
];

export default function AdminTaskList() {
  return (
    <List filters={postFilters}>
      <Datagrid>
        <TextField source="id" />
        <FunctionField source="title" render={renderTitle} />
        <FunctionField source="description" render={renderDescription} />
        <DateField label="Due" source="due_date" />
        <DateField label="Completed" source="completion_date" />
        <FunctionField
          source="priority"
          render={(record) => <PriorityIcon priority={record.priority} />}
        />
        <ReferenceField
          source="created_by"
          reference="users"
          link="show"
          sortable={false}
        />
        <ReferenceArrayField
          reference="tags"
          source="tags"
          sortable={false}
          label="Tags"
        />
        <ReferenceField source="project" reference="projects" link="show" />
      </Datagrid>
    </List>
  );
}

function renderTitle(record: Task) {
  return (
    <Typography maxWidth={120} noWrap variant="body2" color="text.primary">
      {striptags(record.title)}
    </Typography>
  );
}

function renderDescription(record: Task) {
  return (
    <Typography maxWidth={120} noWrap variant="body2" color="text.primary">
      {striptags(record.description ?? "")}
    </Typography>
  );
}
