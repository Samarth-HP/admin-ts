import SchoolIcon from "@mui/icons-material/School";

import UserList from "./UserList";
import UserEdit from "./UserEdit";
import UserCreate from "./UserCreate";
import UserShow from "./UserShow";

export default {
  list: UserList,
  edit: UserEdit,
  create: UserCreate,
  permissions: {
    canEdit: ["Admin","State Admin", "District Admin", "Block Admin", "School Admin"],
    // canDelete: ["Admin"],
    canCreate: ["Admin","State Admin", "District Admin"],
    canList: ["Admin",,"State Admin", "District Admin","Block Admin","School Admin"],
  },
};
