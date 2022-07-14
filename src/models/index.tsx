import { MaterialUnitEnum } from "../constants";

export interface IDataOption {
    id: number;
    name: string;
}

export interface IResWarehouseBalance {
    id: number;
    name: string;
    amount: number;
    unit: MaterialUnitEnum;
    marks: {
        id: number;
        name: string;
        sku: string;
        amount: number;
    }[];
}