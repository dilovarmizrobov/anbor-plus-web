import {UserRolesEnum} from "./index";

const PERMISSIONS = {
    ADMIN: [UserRolesEnum.ADMIN],
    ACCOUNTANT: [UserRolesEnum.ACCOUNTANT],
    WAREHOUSEMAN: [UserRolesEnum.WAREHOUSEMAN],
    LIST: {
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ACCOUNTANT,
        ],
    },
    CREATE: {
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ACCOUNTANT,
        ],
    },
    EDIT: {
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ACCOUNTANT,
        ],
    },
    DELETE: {
        USER: [
            UserRolesEnum.ADMIN,
            UserRolesEnum.ACCOUNTANT,
        ],
    },
}

export default PERMISSIONS