import {MaterialUnitEnum} from "../constants";

export interface IOverheadMaterial {
    id?: number;
    materialId?: number;
    markId?: number;
    material?: IOverheadMaterialOption;
    mark?: IOverheadMaterialMarkOption
    qty: number;
}

export interface IOverheadMaterialOption {
    id: number;
    name: string;
    unit: MaterialUnitEnum;
}

export interface IOverheadMaterialMarkOption {
    id: number;
    name: string;
    sku: string;
    balance: number;
}