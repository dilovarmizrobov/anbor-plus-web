import {IWarehouseRequest} from "./IWarehouse";

export interface IEnterpriseResponse  {
    id : number;
    name: string;
    phoneNumber: string;
}

export interface IEnterpriseRequest  {
    id? : number;
    name: string;
    phoneNumber: string;
}
