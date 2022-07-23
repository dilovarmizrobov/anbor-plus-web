
export interface IGarageInfo {
    id?: number;
    number: string;
    incomeDate: string;
    releaseYear: string;
}

export interface ITechniqueResponse {
    id: number;
    technicCategoryId: number;
    name: string;
    infos: IGarageInfo[];
}

export interface ITechniqueRequest {
    id?: number;
    technicCategoryId: number;
    name: string;
    infos: IGarageInfo[];
}
