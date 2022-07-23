import apiHelper from "./ApiHelper";
import {IReqPriceEdit} from "../models/Overhead";
import api from "../utils/api";
import {IReqOperation} from "../models/Operation";

class OperationService {
    getOperation = (operationId: string) => apiHelper.get(`/overheads/${operationId}/operation`)

    getListOperation = (page: number, size: number, search: string) =>
        apiHelper.get(`/overheads/all/operation`, {page, size, search})

    getListMaterial = (overheadId: string, page: number, size: number) =>
        apiHelper.get(`/overheads/${overheadId}/items`, {size, page, })

    getTotalInfo = (overheadId: string) => apiHelper.get(`/overheads/${overheadId}/operation-total-info`)

    postNewOperation = (operation: IReqOperation, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();
        const blob = new Blob([JSON.stringify(operation)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.post(`overheads/operation`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateOperation = (operation: IReqOperation, images: File[], imageNames: string[]) => new Promise((resolve, reject) => {
        let formData = new FormData();

        const blob = new Blob([JSON.stringify(operation)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        const blobImageNames = new Blob([JSON.stringify(imageNames)], {type: 'application/json'});
        formData.append('imageNames', blobImageNames);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`/overheads/${operation.id!}/operation`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putApproveOperation = (operationId: string) => apiHelper.put(`/overheads/${operationId}/operation/approve`)

    putMaterialPriceEdit = (priceEdit: IReqPriceEdit) => apiHelper.put<IReqPriceEdit>('/overheads/operation/change-item-price', priceEdit)
}

const operationService = new OperationService()

export default operationService