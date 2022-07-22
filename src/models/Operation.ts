import {MaterialUnitEnum, OperationTypeEnum} from "../constants";
import {IOverheadMaterial, IPriceHistory} from "./Overhead";

export interface IResOperation {
    id: number;
    act: string;
    type: OperationTypeEnum;
    comment: string;
    imageNames: string[];
    overheadItems: IOverheadMaterial[];
}

export interface IReqOperation {
    id?: number;
    act: string;
    type: OperationTypeEnum;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IOverheadMaterial[];
}

export interface IResListOperation {
    id: number;
    createdDate: string;
    act: string;
    categories: string[];
    type: OperationTypeEnum;
    warehouse: string;
    createdBy: string;
    approved: boolean;
    imageNames: string[];
}

export interface IResListMaterial {
    id: number;
    material: string;
    mark: string;
    sku: string;
    qty: number;
    balance: number;
    unit: MaterialUnitEnum;
    price?: number;
    total?: number;
    priceHistory: IPriceHistory[];
}

export interface IResTotalInfo {
    type: OperationTypeEnum;
    approved: boolean;
    total: number;
}