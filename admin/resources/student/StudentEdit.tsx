import {
  Edit,
  SimpleForm,
  TextInput,
  useRecordContext,
  useDataProvider,
  BooleanInput,
  NumberInput,
  ReferenceInput,
} from "react-admin";

const StudentForm = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  console.log(dataProvider);
  return (
    <>
      <span>Location Details</span>

      <TextInput source="id" />
      <TextInput source="name" />
      <ReferenceInput source="school_id" reference="school">
        <TextInput label={"SCHOOL"} source="name" />
      </ReferenceInput>
      <ReferenceInput source="school_id" reference="school">
        <TextInput label={"UDISE"} source="udise" />
      </ReferenceInput>
      <TextInput source="father_name" />
      <TextInput source="mother_name" />
      <TextInput source="gender" />
      <NumberInput source="grade_number" />
      <TextInput source="stream_tag" />
      <TextInput source="category" />
      <BooleanInput source="is_cwsn" />
      <BooleanInput source="is_enabled" />
    </>
  );
};
const StudentEdit = () => (
  <Edit>
    <SimpleForm
    //   onSubmit={(values) => {
    //     // We will get Form Values on submission
    //     console.log(values);
    //   }}
    >
      <StudentForm />
    </SimpleForm>
  </Edit>
);
export default StudentEdit;
