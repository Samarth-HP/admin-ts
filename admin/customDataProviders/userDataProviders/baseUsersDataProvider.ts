import { client, clientGQL } from "../../api-clients/users-client";

const Applications: any = {
  e_samwaad_user: "f0ddb3f6-091b-45e4-8c0f-889f89d4f5da",
  shiksha_saathi_user: "1ae074db-32f3-4714-a150-cc8a370eafd1",
};

export const UPDATE_USER_BY_ID_QUERY = `
mutation($object:teacher_set_input!, $id:uuid!){
  update_teacher(where:{user_id:{_eq:$id}}, _set:$object){
    returning{
      id
    }
  }
}`;
const dataProvider = {
  getList: async (
    resource: any,
    { pagination: { page, perPage }, filter }: any
  ): Promise<any> => {
    let queryString = [`registrations.applicationId:${Applications[resource]}`];
    const userData: any = window.localStorage.getItem("userData");
    const roleName: any = JSON.parse(userData)?.user?.user?.registrations[0]?.roles[0];

    if (resource == "shiksha_saathi_user") {
      switch (roleName) {
        case "District Admin":
          const userDistrict = JSON.parse(userData)?.user?.user?.registrations[0]?.data?.roleData?.district;
          queryString = [`registrations.applicationId:${Applications[resource]} AND data.roleData.district: ${userDistrict}`];
          break
        case "Block Admin":
          const userBlock = JSON.parse(userData)?.user?.user?.registrations[0]?.data?.roleData?.block;
          queryString = [`registrations.applicationId:${Applications[resource]} AND data.roleData.block: ${userBlock}`];
          break
      }
    }

    // Pass the UDISES as per Esamwaad Roles Access in the below array.
    // const UDISES = [2100600104, 110, 2080210301].join(" ");
    if (resource == "e_samwaad_user") {
      // queryString = [`registrations.applicationId:${Applications[resource]} AND data.udise: (${UDISES})`]
      queryString = [`registrations.applicationId:${Applications[resource]}`]
    }

    if (filter && Object.keys(filter).length > 0) {
      if (filter?.udise) {
        queryString.push(`${filter?.udise}`);
      }

      if (filter?.shikshaRoles) {
        queryString.push(`registrations.roles:%22${filter?.shikshaRoles}%22`);
      }
      if (filter?.esamwadRoles) {
        queryString.push(`registrations.roles:${filter?.esamwadRoles}`);
      }
      if (filter?.data?.roleData?.district) {
        queryString.push(
          `data.roleData.district:${filter?.data?.roleData?.district}`
        );
      }
      if (filter?.block) {
        queryString.push(`data.roleData.block:"${filter?.block}"`);
      }
      if (filter?.cluster) {
        queryString.push(`data.roleData.cluster:"${filter?.cluster}"`);
      }
      if (filter?.username) {
        queryString.push(
          `username:${filter?.username} OR username:*${filter?.username}*`
        );
        // queryString.push(``);
      }
    }
    const params = {
      startRow: (page - 1) * perPage,
      numberOfResults: perPage,
      queryString: `(${queryString.join(") AND (")})`,
      applicationId: Applications[resource],
    };
    const response = await client.get("/admin/searchUser", { params });
    if (response?.data?.result) {
      return {
        total: response?.data?.result?.total,
        data: response?.data?.result?.users || [],
      };
    } else {
      return {
        total: 0,
        data: [],
      };
    }
  },
  getOne: async (resource: any, { id }: any): Promise<any> => {
    const params = {
      queryString: id
    };
    const response = await client.get("/admin/searchUser", { params });

    if (response?.data?.result) {
      return {
        data: response?.data?.result?.users[0],
      };
    }
    return response;
  },
  getUserByUdise: async (resource: any, { id }: any): Promise<any> => {
    const params = {
      queryString: `(registrations.applicationId:f0ddb3f6-091b-45e4-8c0f-889f89d4f5da) AND (registrations.roles:school) AND (data.udise: ${id})`,
    };
    const response = await client.get("/admin/searchUser", { params });

    if (response?.data?.result) {
      return {
        data: response?.data?.result?.users
      };
    }
    return response;
  },
  changePassword: async (resource: any, payload: any): Promise<any> => {
    const response = await client.post("/admin/changePassword", payload);
    if (response?.data?.msg) {
      return {
        data: response?.data?.msg,
      };
    }
    throw new Error("Unable to update");
  },
  updateUser: async (resource: any, data: any): Promise<any> => {
    const d = data.gql ? JSON.parse(JSON.stringify(data.gql)) : null;
    const id = data.id;
    delete data["designation"];
    delete data["employment"];
    delete data["account_status"];
    delete data["gql"];
    delete data["id"];
    try {
      const response = await client.patch("/admin/updateUser/" + id, data);
      // if (d) {
      //   await clientGQL(UPDATE_USER_BY_ID_QUERY, { object: d, id: id });
      // }
      if (response?.data?.result) {
        return {
          data: response?.data?.result,
        };
      }
    } catch (e) { }
    throw new Error("Unable to update");
  },
};
export default dataProvider;
