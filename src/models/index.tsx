import { MaterialUnitEnum } from "../constants";

export interface ICategoryOption {
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