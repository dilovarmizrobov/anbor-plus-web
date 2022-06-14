import {UserRolesEnum} from "../constants";

export interface IUser {
    name: string;
    role: UserRolesEnum;
}
