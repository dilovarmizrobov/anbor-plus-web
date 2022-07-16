import {IOverheadMaterial} from "./Overhead";
import {IDataOption} from "./index";

export interface IResDisplacement {
    id: number;
    autoDetail: string;
    throwWhom: string;
    warehouseDestinationId: number;
    comment: string;
    imageNames: string[];
    overheadItems: IOverheadMaterial[];
}

export interface IReqDisplacement {
    id?: number;
    autoDetail: string;
    throwWhom: string;
    warehouseDestinationId: number;
    comment: string;
    images: File[];
    imageNames?: string[];
    overheadItems: IOverheadMaterial[]
}

export interface IResDisplacementStatus {
    id: number;
    approved: boolean;
    imageNames: string[];
}

export interface IListDisplacement {
    id: number;
    categories: string[];
    total: number;
    createdDate: string;
    currentWarehouse: IDataOption;
    destinationWarehouse: string;
    approved: boolean;
}

export interface IDisplacementTotalInfo {
    total: number;
    fromWho?: string;
    warehouse: string;
    warehouseId: number;
    destination: string;
    warehouseDestinationId: number;
}