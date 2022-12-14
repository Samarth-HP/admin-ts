import {
  TextInput,
  ReferenceInput,
  SelectInput,
  Edit,
  SimpleForm,
  useDataProvider,
  NumberInput,
  BooleanInput,
  required,
  regex,
  FunctionField,
  Toolbar,
  SaveButton,
  useNotify,
  useRedirect,
  FormDataConsumer,
} from "react-admin";
import { useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import * as _ from "lodash";
import { getLocationDetails } from "../../utils/LocationDetailsHelper";
import EditWrapper from "../../components/styleWrappers/EditWrapper";
import { clientGQL } from "../../api-clients/users-client";

const ASSESSMENT_URL = "https://e-samwad.samagra.io/api/v5/assessment/invalidate/?udises=";
const SCHOOL_CACHE_URL = "https://e-samwad.samagra.io/api/v5/school-cache/invalidate/?udises="

export const SchoolEdit = () => {
  const location = useLocation();
  const notify = useNotify();
  const redirect = useRedirect();
  const [schoolId, setSchoolId] = useState("");
  const [schoolUdise, setSchoolUdise] = useState<any>(null);
  const locationId = useRef();
  const [locationDetails, setLocationDetails] = useState<any>({});
  const params: any = new Proxy(new URLSearchParams(location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });

  const initialFilters = params.filter ? JSON.parse(params.filter) : null;
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialFilters?.district || ""
  );
  const [selectedBlock, setSelectedBlock] = useState(
    initialFilters?.block || ""
  );
  const [selectedCluster, setSelectedCluster] = useState(
    initialFilters?.cluster || ""
  );
  const dataProvider = useDataProvider();
  const {
    data: _districtData,
    isLoading,
    error,
  } = useQuery(["location", "getList", {}], () =>
    dataProvider.getList("location", {
      pagination: { perPage: 10000, page: 1 },
      sort: { field: "id", order: "asc" },
      filter: {},
    })
  );

  const handleLocationChange = async (value: string) => {
    if (!value) return "Pleae select an option";
    let res: any = await clientGQL(`
    query {
      location(where: {district: {_eq: "${locationDetails.district}"}, block: {_eq: "${locationDetails.block}"}, cluster: {_eq: "${locationDetails.cluster}"}}) {
        id,
        district,
        block,
        cluster
      }
    }    
  `)
    res = await res.json();
    if (res?.data?.location?.[0]?.id) {
      locationId.current = res?.data?.location?.[0]?.id;
      console.log(locationId.current)
      return undefined;
    }
    else {
      locationId.current = undefined;
      console.log(locationId.current)
      return "Not a valid location combination"
    }
  }

  // const districtData = useMemo(() => {
  //   return _districtData?.data;
  // }, [_districtData]);

  // const districts = useMemo(() => {
  //   if (!districtData) {
  //     return [];
  //   }
  //   return _.uniqBy(districtData, "district").map((a) => {
  //     return {
  //       id: a.district,
  //       name: a.district,
  //     };
  //   });
  // }, [districtData]);

  // const blocks = useMemo(() => {
  //   if (!selectedDistrict || !districtData) {
  //     return [];
  //   }

  //   return _.uniqBy(
  //     districtData.filter((d) => d.district === selectedDistrict),
  //     "block"
  //   ).map((a) => {
  //     return {
  //       id: a.block,
  //       name: a.block,
  //     };
  //   });
  // }, [selectedDistrict, districtData]);

  // const clusters = useMemo(() => {
  //   if (!selectedBlock || !districtData) {
  //     return [];
  //   }
  //   return _.uniqBy(
  //     districtData.filter((d) => d.block === selectedBlock),
  //     "cluster"
  //   ).map((a) => {
  //     return {
  //       id: a.cluster,
  //       name: a.cluster,
  //     };
  //   });
  // }, [selectedBlock, districtData]);

  // Input Constraints
  const inputConstraints = {
    // userName: [required("Please provide username"), number("The username must be numeric")],
    // udise: [required("Please provide UDISE"), number("The UDISE must be numeric"), udiseSchoolCheck],
    fullName: [required("Please provide fullname"), regex(/^[a-zA-Z0-9 ]*$/, "Name can only contain alphabets, numbers and spaces")],
    // mobile: [required("Please provide mobile number"), number("Mobile must be numeric"), minLength(10), maxLength(10)],
    session: required("Please select session"),
    district: handleLocationChange,
    block: handleLocationChange,
    cluster: handleLocationChange,
    type: required("Please select type"),
    coord: [required("Please enter a valid co-ordinate"), regex(/^[1-9]\d*(\.\d+)?$/, "Please enter a valid co-ordinate")]
  }

  const { districts, blocks, clusters } = getLocationDetails();

  const EditToolbar = (props: any) => (
    <Toolbar  {...props}>
      <SaveButton sx={{ backgroundColor: "green" }} />
    </Toolbar>
  );
  const onSuccess = () => {
    // Clearing school cache;
    const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") as string) : null;
    const token = userData?.user?.token;
    fetch(SCHOOL_CACHE_URL + `[${schoolUdise}]`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    fetch(ASSESSMENT_URL + `[${schoolUdise}]`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (schoolId && locationId.current)
      clientGQL(`
      mutation {
        update_school(where: {id: {_eq: ${schoolId}}}, _set: {location_id: ${locationId.current}}) {
          affected_rows
        }
      }
      `)
    notify("School updated successfully", { type: 'success' });
    redirect("/school");
  }

  const onError = (err: any) => {
    if (err.toString() == 'Error: ra.notification.data_provider_error' && schoolId && locationId.current) {
      clientGQL(`
      mutation {
        update_school(where: {id: {_eq: ${schoolId}}}, _set: {location_id: ${locationId.current}}) {
          affected_rows
        }
      }
      `)
      const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") as string) : null;
      const token = userData?.user?.token;
      fetch(SCHOOL_CACHE_URL + `[${schoolUdise}]`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      fetch(ASSESSMENT_URL + `[${schoolUdise}]`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      notify(`School updated successfully`, { type: 'success' });
      redirect(`/school`);
    } else {
      notify(`Unable to update school: ${err.toString}`, { type: 'error' });
      redirect(`/school`);
    }
  }



  return (
    <Edit mutationOptions={{ onSuccess, onError }} mutationMode={'pessimistic'}>
      <SimpleForm toolbar={<EditToolbar />}>
        {/* <ReferenceInput source="id" reference="location">
          <SelectInput disabled optionText={"id"} />
        </ReferenceInput> */}
        <TextInput source="name" validate={inputConstraints.fullName} />
        <SelectInput source="session" label="Session" choices={["S", "W"].map(el => { return { id: el, name: el } })} validate={inputConstraints.session} />
        <SelectInput source="type" label="Type" choices={["GPS", "GMS", "GHS", "GSSS"].map(el => { return { id: el, name: el } })} validate={inputConstraints.type} />
        <NumberInput source="udise" disabled />
        <NumberInput source="enroll_count" />
        <BooleanInput source="is_active" />
        <NumberInput source="latitude" />
        <NumberInput source="longitude" />
        <SelectInput
          label="District"
          key={"district"}
          onChange={(e: any) => {
            setSelectedDistrict(e.target.value);
            setSelectedBlock(null);
            setSelectedCluster(null);
          }}
          value={selectedDistrict}
          source="location.district"
          choices={districts}
          validate={inputConstraints.district}
        />
        <SelectInput
          label="Block"
          onChange={(e) => {
            setSelectedBlock(e.target.value);
            setSelectedCluster(null);
          }}
          value={selectedBlock}
          source="location.block"
          choices={blocks}
          validate={inputConstraints.block}
        />
        <SelectInput
          label="Cluster"
          onChange={(e) => setSelectedCluster(e.target.value)}
          value={selectedCluster}
          source="location.cluster"
          validate={inputConstraints.cluster}
          choices={clusters}
        />
        <FormDataConsumer>
          {({ formData }) => {
            if (schoolId != formData.id)
              setSchoolId(formData.id);
            if (!schoolUdise)
              setSchoolUdise(formData.udise);
            if (formData.location.district != locationDetails?.district || formData.location.block != locationDetails?.block || formData.location.cluster != locationDetails?.cluster)
              setLocationDetails({ ...locationDetails, district: formData.location.district, block: formData.location.block, cluster: formData.location.cluster })
            return <></>
          }}
        </FormDataConsumer>
      </SimpleForm>
    </Edit>
  );
};
export default SchoolEdit;
