import React from "react";
import { DeleteWithConfirmButton, Edit, SaveButton, SimpleForm, Toolbar } from "react-admin";

const EditToolbar = (props: any) => (
  <Toolbar  {...props}>
    <SaveButton sx={{ backgroundColor: "green" }} />
    {props.allowDelete && <DeleteWithConfirmButton sx={{ marginLeft: 5 }} />}
  </Toolbar>
);
const EditWrapper = (props: any) => {
  return (
    <div>
      <Edit className="edit_wrapper" {...props} mutationMode={"pessimistic"}>
        <div className="edit_wrapper_layout">
          <SimpleForm toolbar={<EditToolbar allowDelete={props.allowDelete} />}>
            {props.children}
          </SimpleForm>
        </div>
      </Edit>
      <style>
        {`
          .RaEdit-main {
            max-height: 80vh !important;
          }

          @media screen and (max-width: 480px) {
           .RaEdit-main {
              max-height: 100vh !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditWrapper;
