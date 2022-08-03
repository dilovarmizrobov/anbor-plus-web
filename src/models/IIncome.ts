import {IncomeTypeEnum} from "../constants";
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
    number: string;
    createdDate: string;
    categories: string[];
    total: number;
    fromWho: string;
    comment: string;
    imageNames: string[];
}

export interface IIncomeTotalInfo {
    fromWho: string;
    total: number;
    warehouse: string;
}
