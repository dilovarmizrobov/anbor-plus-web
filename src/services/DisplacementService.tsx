import api from "../utils/api";
import {IReqDisplacement} from "../models/Displacement";
import apiHelper from "./ApiHelper";

class DisplacementService {
    getDisplacement = (displacementId: string) => apiHelper.get(`/overheads/${displacementId}/displacement`)

    postNewDisplacement = (displacement: IReqDisplacement, images: File[]) => new Promise((resolve, reject) => {
        let formData = new FormData();
        const blob = new Blob([JSON.stringify(displacement)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.post(`overheads/displacement`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    putUpdateDisplacement = (displacement: IReqDisplacement, images: File[], imageNames: string[]) => new Promise((resolve, reject) => {
        let formData = new FormData();

        const blob = new Blob([JSON.stringify(displacement)], {type: 'application/json'});
        formData.append('mainInfo', blob);

        const blobImageNames = new Blob([JSON.stringify(imageNames)], {type: 'application/json'});
        formData.append('imageNames', blobImageNames);

        for (let i = 0; i < images.length; i++) formData.append('images', images[i])

        api.put(`/overheads/${displacement.id!}`, formData)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const displacementService = new DisplacementService()

export default displacementService