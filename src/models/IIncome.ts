import {IncomeTypeEnum, MaterialUnitEnum} from "../constants";
import {IOverheadMaterial} from "./Overhead";

export interface IIncomeRequest {
    id?: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: IncomeTypeEnum;
    fromWhoId: number;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IOverheadMaterial[]
}

export interface IIncomeResponse {
    id: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: IncomeTypeEnum;
    fromWhoId: number;
    comment: string;
    images: string[];
    imageNames: string[];
    overheadItems: IOverheadMaterial[]
}

export interface IIncomeListResponse {
    id: number;
    createdDate: string;
    categories: string[];
    total: number;
    fromWho: string;
    comment: string;
    imageNames: string[];
}

export interface PriceHistory {
    id: number;
    createdBy: string;
    createdDate: string;
    price: number;
    comment?: string;
}

export interface PriceEditRequest {
    itemId: number;
    price: number;
    comment: string;
}

export interface IIncomeMaterialListResponse {
    id: number;
    material: string;
    mark: string;
    sku: string;
    qty: number;
    unit: MaterialUnitEnum;
    price?: number;
    total?: number;
    priceHistory: PriceHistory[];
}

export interface IIncomeTotalInfo {
    fromWho: string;
    total: number;
    warehouse: string;
}