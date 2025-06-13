import {
  Edit,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
} from "react-admin";

export default function AdminProjectEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="title" />
        <NumberInput source="order" />
        <SelectInput
          source="view"
          choices={[
            { id: "board", name: "Board" },
            { id: "list", name: "List" },
          ]}
        />
      </SimpleForm>
    </Edit>
  );
}
