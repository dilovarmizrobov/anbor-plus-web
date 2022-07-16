import {UserRolesEnum} from "../constants";
import {IWarehouseOption, IWarehouseResponse} from "./IWarehouse";

export interface IUser {
    fullName: string;
    role: UserRolesEnum;
    warehouse: IWarehouseOption;
}

export interface IUserResponse {
    id: number;
    fullName: string;
    role: UserRolesEnum;
    warehouse?: IWarehouseResponse;
    phoneNumber: string;
}

export interface IUserRequest {
    id?: number;
    fullName: string;
    role: UserRolesEnum;
    warehouseId?: number;
    phoneNumber: string;
    password: string;
}
