import {IOverheadMaterial} from "./Overhead";

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

