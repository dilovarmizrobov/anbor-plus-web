import {IncomeTypeEnum, MaterialUnitEnum} from "../constants";

export interface IIncomeOption {
    id: number;
    name: string;
}

export interface IIncomeMaterial {
    id?: number;
    materialId?: number;
    material?: IIncomeMaterialOption;
    markId?: number;
    mark?: IIncomeMaterialMarkOption
    qty: number;
}

export interface IIncomeRequest {
    id?: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: IncomeTypeEnum;
    fromWhoId: number;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IIncomeMaterial[]
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
    overheadItems: IIncomeMaterial[]
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

export interface IIncomeMaterialOption {
    id: number;
    name: string;
    unit: MaterialUnitEnum;
}

export interface IIncomeMaterialMarkOption {
    id: number;
    name: string;
    sku: string;
    balance: number;
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