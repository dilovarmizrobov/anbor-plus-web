import apiHelper from "./ApiHelper";
import {FilterPriceTypeEnum, IncomeTypeEnum, OverheadTypeEnum} from "../constants";
import {IIncomeRequest} from "../models/IIncome";
import api from "../utils/api";

class IncomeService {
    getIncome = (incomeId: string) => apiHelper.get(`/overheads/${incomeId}`)

    getListIncome = (page: number, size: number, startDate?: string, endDate?: string, filterPriceType?: FilterPriceTypeEnum, filterIncomeType?: string, filterIncomeFromWho?: string) => {
        let extraParams: any = {};

        filterPriceType && (extraParams.priceType = filterPriceType)

        if (filterIncomeFromWho) {
            extraParams.typeFrom = filterIncomeType
            extraParams.fromWho = filterIncomeFromWho
        }

        return apiHelper.get(`/overheads/all/${OverheadTypeEnum.INCOME}`, {size, page, startDate, endDate, extraParams})
    }

    getOptionProviders = (type: IncomeTypeEnum) => apiHelper.get(`/overheads/${type}/option`)

    getIncomeTotalInfo = (incomeId: string) => apiHelper.get(`/overheads/${incomeId}/total-info`)

    postNewIncome = (income: IIncomeRequest, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();
        const blob = new Blob([JSON.stringify(income)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.post(`overheads/${OverheadTypeEnum.INCOME}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateIncome = (income: IIncomeRequest, images: File[], imageNames: string[]) => new Promise((resolve, reject) => {
        let formData = new FormData();

        const blob = new Blob([JSON.stringify(income)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        const blobImageNames = new Blob([JSON.stringify(imageNames)], {type: 'application/json'});
        formData.append('imageNames', blobImageNames);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`/overheads/${income.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const incomeService = new IncomeService()

export default incomeService