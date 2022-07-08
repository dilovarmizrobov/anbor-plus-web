import {OverheadTypeEnum, OutcomeTypeEnum, FilterPriceTypeEnum} from "../constants";
import apiHelper from "./ApiHelper";
import {IOutcomeRequest, PriceEditRequest} from "../models/IOutcome";
import api from "../utils/api";

class OutcomeService {
    getOutcome = (outcomeId: string) => apiHelper.get(`/overheads/${outcomeId}`)

    getOutcomeList = ( page: number, size: number, startDate?: string, endDate?: string, filterPriceType?: FilterPriceTypeEnum, filterOutcomeFromWho?: string) =>{
        let extraParams: any = {}

        filterPriceType && (extraParams.priceType = filterPriceType)

        filterOutcomeFromWho && (extraParams.fromWho = filterOutcomeFromWho)

       return apiHelper.get(`/overheads/all/${OverheadTypeEnum.OUTCOME}`, {size, page, startDate, endDate, extraParams})
    }


    getListOutcomeMaterial = (outcomeId: string, page: number, size:number) =>
        apiHelper.get(`/overheads/${outcomeId}/items`, {size, page})

    getOutcomeTotalInfo = (outcomeId: string) => apiHelper.get(`/overheads/${outcomeId}/total-info`)

    getOptionMaterials = (query: string) => apiHelper.get(`/materials/find`, {search: query})

    getOptionMarks = (materialId: number) => apiHelper.get(`/materials/marks/${materialId}`)

    getOptionOutcomeType = (type: OutcomeTypeEnum) => apiHelper.get(`/overheads/${type}/option`)

    postNewOutcome = (outcome: IOutcomeRequest, images: File[]) => new Promise((resolve,reject) => {
        let formData = new FormData()
        const blob = new Blob([JSON.stringify(outcome)], {type: 'application/json'})
        formData.append('mainInfo', blob)

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        let type = encodeURI(`${OverheadTypeEnum.OUTCOME}`)

            api.post(`overheads/` + type, formData, )
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateOutcome = (outcome: IOutcomeRequest, images: File[], imageNames: string[]) => new Promise((resolve, reject) => {
        let formData = new FormData()

        let blob = new Blob([JSON.stringify(outcome)], {type: 'application/json'})
        formData.append('mainInfo', blob)

        const blobImageNames = new Blob([JSON.stringify(imageNames)], {type: 'application/json'})
        formData.append('imageNames', blobImageNames)

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`/overheads/${outcome.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putMaterialPriceEdit = (priceEdit: PriceEditRequest) => apiHelper.put<PriceEditRequest>('/overheads/change-item-price', priceEdit)
}

const outcomeService = new OutcomeService()

export default outcomeService
