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
    // residue: number;
}