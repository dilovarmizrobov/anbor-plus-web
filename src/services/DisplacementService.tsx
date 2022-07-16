import api from "../utils/api";
import {IReqDisplacement} from "../models/Displacement";
import apiHelper from "./ApiHelper";
import {OverheadTypeEnum} from "../constants";

class DisplacementService {
    getDisplacementStatus = (displacementId: string) => apiHelper.get(`/overheads/${displacementId}/displacement/images`)

    getDisplacement = (displacementId: string) => apiHelper.get(`/overheads/${displacementId}/displacement`)

    getListDisplacement = (page: number, size: number, search: string, startDate?: string, endDate?: string,) =>
        apiHelper.get(`/overheads/all/${OverheadTypeEnum.DISPLACEMENT}`, {size, page,search, startDate, endDate})

    getDisplacementTotalInfo = (displacementId: string) => apiHelper.get(`/overheads/${displacementId}/total-info`)

    postNewDisplacement = (displacement: IReqDisplacement, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();
        const blob = new Blob([JSON.stringify(displacement)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.post(`overheads/displacement`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUploadImageDisplacement = (displacementId: number, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`overheads/${displacementId}/displacement/upload-image`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putApproveDisplacement = (displacementId: number) => apiHelper.put(`/overheads/${displacementId}/displacement/approve`)

    putUpdateDisplacement = (displacement: IReqDisplacement, images: File[], imageNames: string[]) => new Promise((resolve, reject) => {
        let formData = new FormData();

        const blob = new Blob([JSON.stringify(displacement)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        const blobImageNames = new Blob([JSON.stringify(imageNames)], {type: 'application/json'});
        formData.append('imageNames', blobImageNames);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`/overheads/${displacement.id!}/displacement`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    deleteImageDisplacement = (displacementId: number, imageName: string) =>
        apiHelper.delete(`/overheads/${displacementId}/displacement/delete-image?imageName=${imageName}`)
}

const displacementService = new DisplacementService()

export default displacementService