import {IOverheadMaterial} from "./Overhead";
import {MaterialUnitEnum} from "../constants";

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
    createdDate: string;
    currentWarehouse: string;
    destinationWarehouse: string;
    approved: boolean;
}

export interface IDisplacementMaterialListResponse {
    id: number;
    material: string;
    mark: string;
    sku: string;
    qty: number;
    unit: MaterialUnitEnum;
    price: number;
    total: number;
    priceHistory: PriceHistory[];
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

export interface IDisplacementTotalInfo {
    total: number;
    fromWho?: string;
    warehouse: string;
    destination: string;
}
