import apiHelper from "./ApiHelper";
import {IncomeTypeEnum} from "../constants";
import {IIncomeRequest} from "../models/IIncome";
import api from "../utils/api";

class IncomeService {
    getIncome = (incomeId: string) => apiHelper.get(`/overheads/${incomeId}`)

    getListIncome = (page: number, size: number, startDate?: string, endDate?: string) =>
        apiHelper.get(`/overheads`, {size, page, startDate, endDate})

    getOptionProviders = (type: IncomeTypeEnum) => apiHelper.get(`/overheads/${type}/option`)

    getOptionMaterials = (query: string) => apiHelper.get(`/materials/find`, {search: query})

    getOptionMarks = (materialId: number) => apiHelper.get(`/materials/marks/${materialId}`)

    postNewIncome = (income: IIncomeRequest, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();
        const blob = new Blob([JSON.stringify(income)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.post(`overheads`, formData)
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