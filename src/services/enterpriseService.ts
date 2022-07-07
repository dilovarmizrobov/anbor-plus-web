import apiHelper from "./ApiHelper";
import { IEnterpriseRequest} from "../models/IEnterprise";


class EnterpriseService {
    getEnterprise = (enterpriseId: string) => apiHelper.get(`/enterprises/${enterpriseId}`)

    getListEnterprise = (page: number, size: number, search: string,) =>
        apiHelper.get(`/enterprises`, {page, size, search})

    postNewEnterprise = (enterprise : IEnterpriseRequest) => apiHelper.post<IEnterpriseRequest>(`/enterprises`,enterprise)

    putUpdateEnterprise = (enterprise: IEnterpriseRequest) => apiHelper.put<IEnterpriseRequest>(`/enterprises/${enterprise.id!}`, enterprise)

    deleteEnterprise = (enterpriseId: number) => apiHelper.delete(`enterprises/${enterpriseId}`)
}

const enterpriseService = new EnterpriseService()

export default enterpriseService;
