import {MaterialUnitEnum, OutcomeUnitEnum} from "../constants";

export interface IOutcomeOption {
    id: number;
    name : string;
}

export interface IOutcomeMaterial {
    id?: number;
    materialId?: number;
    material?: IOutcomeMaterialOption;
    markId?: number;
    mark?: IOutcomeMaterialMarkOption
    qty: number;
}

export interface IOutcomeRequest {
    id?: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: OutcomeUnitEnum;
    fromWhoId: number;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IOutcomeMaterial[];
}

export interface IOutcomeResponse {
    id: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: OutcomeUnitEnum;
    fromWhoId: number;
    comment: string;
    images: string[];
    imageNames: string[];
    overheadItems: IOutcomeMaterial[]
}

export interface IOutcomeMaterialMarkOption {
    id: number;
    name: string;
    sku: string;
}

export interface IOutcomeMaterialOption {
    id: number;
    name: string;
    unit: MaterialUnitEnum;
}


export interface IOutcomeListResponse {
    id: number;
    createdDate: string;
    categories: string[];
    total: number;
    fromWho: string;
    comment: string;
    imageNames: string[];
}

export interface IOutcomeMaterialListResponse {
    id: number;
    material: string;
    mark: string;
    sku: string;
    qty: number;
    unit: MaterialUnitEnum;
    price?: number;
    total?: number;
    priceHistory?: PriceHistory[];
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

export interface IOutcomeTotalInfo {
    fromWho: string;
    total: number;
    warehouse: string;
}





