import {MaterialUnitEnum} from "../constants";

export interface IMaterialMark {
    id?: number;
    name: string;
    sku: string;
}

export interface IMaterialResponse {
    id: number;
    categoryId: number;
    name: string;
    unit: MaterialUnitEnum;
    marks: IMaterialMark[]
}

export interface IMaterialRequest {
    id?: number;
    categoryId: number;
    name: string;
    unit: MaterialUnitEnum;
    marks: IMaterialMark[];
}