import React from "react";
import {
  FunctionField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const ApplicationId = "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da";
const UserShow = () => {
  const DisplayRoles = (a: any) => {
    const registration = a.registrations?.find(
      (r: any) => r.applicationId === ApplicationId
    );
    if (!registration) {
      return <span>-</span>;
    }
    const { roles } = registration;
    return roles.map((role: any, index: number) => {
      return (
        <span
          style={{
            border: "1px solid rgba(224, 224, 224, 1)",
            padding: "5px",
            marginRight: "5px",
            marginBottom: "5px",
          }}
          key={index}
        >
          {role}
        </span>
      );
    });
  };
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="username" />
        <FunctionField
          label="Full Name"
          render={(record: any) => `${record.firstName} ${record.lastName}`}
        />
        ;
        <NumberField source="mobilePhone" label="Mobile Phone" />
        <FunctionField
          label="Full Name"
          render={(record: any) => `${record.firstName} ${record.lastName}`}
        />
        ;
        <FunctionField
          label="Role"
          render={(record: any) => DisplayRoles(record)}
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default UserShow;