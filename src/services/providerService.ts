import apiHelper from "./ApiHelper";
import {IProviderRequest} from "../models/IProvider";

class ProviderService{

    getProvider = (providerId: string) => apiHelper.get(`/providers/${providerId}`)

    getListProvider = (page: number, size: number, search: string) =>
        apiHelper.get(`/providers`, {page, size, search})

    postNewProvider = (provider : IProviderRequest) => apiHelper.post<IProviderRequest>(`/providers`,provider)

    putUpdateProvider = (provider: IProviderRequest) => apiHelper.put<IProviderRequest>(`/providers/${provider.id!}`, provider)

    deleteProvider = (providerId: number) => apiHelper.delete(`providers/${providerId}`)
}

const providerService = new ProviderService()

export default providerService
