import {
  Datagrid,
  List,
  TextField,
  ReferenceField,
  DateField
} from "react-admin";

const GradeAssessmentList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <ReferenceField source="assessment_id" reference="assessment">
          <TextField label={"Type"} source="type" />
        </ReferenceField>
        <ReferenceField source="school_id" reference="school">
          <TextField label={"Type"} source="name" />
        </ReferenceField>

        <TextField source="section" />
        <TextField source="grade_number" />
        <ReferenceField source="streams_id" reference="stream">
          <TextField label={"tag"} source="tag" />
        </ReferenceField>
        <DateField source="created" />
        <DateField source="updated" />
      </Datagrid>
    </List>
  );
};
export default GradeAssessmentList;
