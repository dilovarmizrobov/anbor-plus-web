import {UserRolesEnum} from "../constants";

export interface IUser {
    fullName: string;
    role: UserRolesEnum;
}

export interface IUserResponse {
    id: number;
    fullName: string;
    role: UserRolesEnum;
    // warehouse: [];
    phoneNumber: string;
}

export interface IUserRequest {
    id?: number;
    fullName: string;
    role: UserRolesEnum;
    phoneNumber: string;
    password: string;
}
