export interface IWarehouseResponse {
    id: number;
    name: string;
    enterpriseName: string;
}

export interface IWarehouseRequest {
    id?: number;
    name: string;
    enterpriseName: string;
}