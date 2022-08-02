import {MaterialUnitEnum} from "../constants";

export interface IOverheadMaterial {
    id?: number;
    materialId?: number;
    markId?: number;
    material?: IOverheadMaterialOption;
    mark?: IOverheadMaterialMarkOption
    qty: number;
}

export interface IOverheadMaterialOption {
    id: number;
    name: string;
    unit: MaterialUnitEnum;
}

export interface IOverheadMaterialMarkOption {
    id: number;
    name: string;
    sku: string;
    balance: number;
}

export interface IResListMaterial {
    id: number;
    material: string;
    mark: string;
    sku: string;
    qty: number;
    unit: MaterialUnitEnum;
    price?: number;
    offerPrice: number;
    total?: number;
    priceHistory: IPriceHistory[];
}

export interface IPriceHistory {
    id: number;
    createdBy: string;
    createdDate: string;
    price: number;
    comment?: string;
}

export interface IReqPriceEdit {
    itemId: number;
    price: number;
    comment: string;
}