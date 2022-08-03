import {OutcomeTypeEnum} from "../constants";
import {IOverheadMaterial} from "./Overhead";

export interface IOutcomeRequest {
    id?: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: OutcomeTypeEnum;
    fromWhoId: number;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IOverheadMaterial[];
}

export interface IOutcomeResponse {
    id: number;
    autoDetail: string;
    throwWhom: string;
    typeFrom: OutcomeTypeEnum;
    technicId?: number;
    fromWhoId: number;
    comment: string;
    images: string[];
    imageNames: string[];
    overheadItems: IOverheadMaterial[]
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

export interface IOutcomeTotalInfo {
    fromWho: string;
    total: number;
    warehouse: string;
}





