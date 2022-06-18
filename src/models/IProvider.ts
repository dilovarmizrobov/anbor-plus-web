
export interface IProviderResponse {
    id: number;
    name: string;
    phoneNumber: string
}

export interface IProviderRequest {
    id?: number;
    name: string;
    phoneNumber: string;
}
