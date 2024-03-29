import {
  TextField,
  TextInput,
  useDataProvider,
  SelectInput,
  BulkDeleteButton,
} from "react-admin";
import { ListDataGridWithPermissions } from "../../components/lists";
import { useQuery } from "react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { assessmentTypeChoices, gradeNumberChoices } from "../../utils/InputChoicesHelper";
import UserService from "../../utils/user.util";

const GradeAssessmentList = () => {


  const [filterObj, setFilterObj] = useState<any>({})
  const [userLevel, setUserLevel] = useState<any>({ district: false, block: false });

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

  const districtData = useMemo(() => {
    return _districtData?.data;
  }, [_districtData]);

  const districts = useMemo(() => {
    if (!districtData) {
      return [];
    }
    return _.uniqBy(districtData, "district").map((a) => {
      return {
        id: a.district,
        name: a.district,
      };
    });
  }, [districtData]);

  const blocks = useMemo(() => {
    if (!districtData) {
      return [];
    }

    if (userLevel.district && !userLevel.block && !selectedDistrict) {
      return _.uniqBy(
        districtData.filter((d) => d.district === userLevel?.district[0]?.name),

        "block"
      ).map((a) => {
        return {
          id: a.block,
          name: a.block,
        };
      });
    }

    if (selectedDistrict) {
      return _.uniqBy(
        districtData.filter((d) => d.district === selectedDistrict),

        "block"
      ).map((a) => {
        return {
          id: a.block,
          name: a.block,
        };
      });
    }

    return _.uniqBy(
      districtData,
      "block"
    ).map((a) => {
      return {
        id: a.block,
        name: a.block,
      };
    });
  }, [selectedDistrict, districtData]);

  const clusters = useMemo(() => {

    if (!districtData) {
      return [];
    }


    if (userLevel.district && !userLevel.block && !selectedBlock) {
      return _.uniqBy(
        districtData.filter((d) => d.district === userLevel?.district[0]?.name),
        "cluster"
      ).map((a) => {
        return {
          id: a.cluster,
          name: a.cluster,
        };
      });
    }


    if (userLevel.district && userLevel.block && !selectedBlock) {
      return _.uniqBy(
        districtData.filter((d) => d.block === userLevel?.block[0]?.name),

        "cluster"
      ).map((a) => {
        return {
          id: a.cluster,
          name: a.cluster,
        };
      });
    }



    if (selectedBlock) {
      return _.uniqBy(
        districtData.filter((d) => d.block === selectedBlock),

        "cluster"
      ).map((a) => {
        return {
          id: a.cluster,
          name: a.cluster,
        };
      });
    }

    return _.uniqBy(
      districtData,
      "cluster"
    ).map((a) => {
      return {
        id: a.cluster,
        name: a.cluster,
      };
    });
  }, [selectedBlock, districtData, selectedBlock]);



  const Filters = [
    <TextInput label="UDISE" source="school#udise" key={"search"} alwaysOn />,
    <SelectInput label="Grade Number" source="grade_number" key={"search"} choices={gradeNumberChoices} />,
    <SelectInput source="assessment#type" label="Assessment Type" choices={assessmentTypeChoices} />,
    <SelectInput
      label="District"
      onChange={(e: any) => {
        setSelectedDistrict(e.target.value);
        setSelectedBlock(null);
        setSelectedCluster(null);
      }}
      source="school#location#district"
      choices={userLevel?.district ? userLevel?.district : districts}
    />,
    <SelectInput
      label="Block"
      onChange={(e) => {
        setSelectedBlock(e.target.value);
        setSelectedCluster(null);
      }}
      value={selectedBlock}
      source="school#location#block"
      choices={userLevel?.block ? userLevel?.block : blocks}

    />,
    <SelectInput
      label="Cluster"
      onChange={(e) => setSelectedCluster(e.target.value)}
      value={selectedCluster}
      source="school#location#cluster"
      choices={clusters}
    />,

  ];
  const handleInitialRender = useCallback(async () => {
    // Hotfix to remove 'Save current query...' and 'Remove all filters' option from filter list #YOLO
    const a = setInterval(() => {
      let x = document.getElementsByClassName('MuiMenuItem-gutters');
      for (let i = 0; i < x.length; i++) {
        if (x[i].textContent == 'Save current query...' || x[i].textContent == 'Remove all filters') {
          x[i].parentElement?.removeChild(x[i]);
        }
      }
    }, 50);

    let user = new UserService()
    let { district, block }: any = await user.getInfoForUserListResource()


    if (district && block) {
      if (Array.isArray(district)) {
        setSelectedDistrict(district[0].name)
      }

      if (Array.isArray(block)) {
        setSelectedBlock(block[0].name)
        setFilterObj({ "school#location#block": block[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
        block
      }))
    } else {
      if (Array.isArray(district)) {
        setSelectedDistrict(district[0].name)
        setFilterObj({ "school#location#district": district[0].name })
      }
      setUserLevel((prev: any) => ({
        ...prev,
        district,
      }))
    }

    return (() => clearInterval(a))
  }, [])

  useEffect(() => {
    handleInitialRender()
  }, [handleInitialRender])

  const onSuccess = async (data: any) => {

    let idList = Array.from(new Set(data.map((el: any) => el.id)))
    let udiseList = Array.from(new Set(data.map((el: any) => el.udise)))

    // Invalidating cache on deletion
    const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData") as string) : null;
    const token = userData?.user?.token;

    fetch(`https://e-samwad.samagra.io/api/v5/assessment/invalidate/v2/?assessments=[${idList.toString()}]&udises=[${udiseList.toString()}]`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(async (res: any) => {
      res = await res.json();
      console.log("RESS--->", res);
      setTimeout(() => {
        window.location.reload();
      }, 1000)
    })
  }

  return (
    <ListDataGridWithPermissions
      dataGridProps={{ rowClick: "show" }}
      listProps={{ filters: Filters, filter: filterObj, sort: { field: 'assessment_id', order: 'DESC' } }}
      withDelete={< BulkDeleteButton mutationOptions={{ onSuccess }} mutationMode={'pessimistic'} />}
    >
      <TextField source="id" />
      <TextField label={"Assessment"} source="assessment_id" />
      <TextField source="grade_number" />
      <TextField source="section" />
      <TextField source="school_id" />
      <TextField source="assessment.type" label="Assessment Type" />
      <TextField source="assessment.assessment_type.name" label="Assessment Name" />
      <TextField source="assessment.assessment_type.assessment_category.name" label="Assessment Category" />
      <TextField source="school.udise" label="UDISE" />
      <TextField source="school.location.district" label="District" />
      <TextField source="school.location.block" />
      <TextField source="school.location.cluster" />
      <TextField source="streams_id" />
    </ListDataGridWithPermissions >
  );
};
export default GradeAssessmentList;

