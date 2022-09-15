import { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
} from "react-admin";
import { useLogin } from "../hooks";
import { getLowerDesignationsChoices } from "../designation";
// const ApplicationId = "1ae074db-32f3-4714-a150-cc8a370eafd1";

const UserCreate = (props: any) => {
  const { user: _loggedInUser } = useLogin();
  const handleSubmit = () => {
    console.log(state, "I am geting submitted ");
  };
  // to be called when submitted
  const createUser = () => {
    // to be completed
  };

  const [state, setState] = useState({
    userName: "",
    fullName: "",
    mobile: "",
    roles: "School",
    udise: "",
    designation: "",
  });
  const designationChoices = getLowerDesignationsChoices(_loggedInUser);
  const roleChoices = [
    { id: "Teacher", name: "Teacher" },
    { id: "Principal", name: "Principal" },
    { id: "school", name: "school" },
  ];
  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        <TextInput
          onChange={(e) => setState({ ...state, userName: e.target.value })}
          source="userName"
          label="User Name"
        />
        <TextInput
          onChange={(e) => setState({ ...state, fullName: e.target.value })}
          source="fullName"
          label="Name"
        />
        <NumberInput
          onChange={(e) => setState({ ...state, mobile: e.target.value })}
          source="mobilePhone"
          label="Mobile Phone"
        />
        <SelectInput
          onChange={(e) => setState({ ...state, roles: e.target.value })}
          source="roles"
          value={state.roles}
          disabled
          choices={roleChoices}
          label="Roles"
        />
        <SelectInput
          value={state.designation}
          onChange={(e: any) =>
            setState({ ...state, designation: e.target.value })
          }
          source="designation"
          label="Designation"
          choices={designationChoices}
        />
        <ReferenceInput source="school_id" reference="school">
          <TextInput
            onChange={(e) => setState({ ...state, udise: e.target.value })}
            source="udise"
            label="School UDISE"
          />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};
export default UserCreate;
