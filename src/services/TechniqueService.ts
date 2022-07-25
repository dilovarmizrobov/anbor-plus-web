import apiHelper from "./ApiHelper";
import {ITechniqueRequest} from "../models/ITechnique";

class TechniqueService {
    getTechnique = (techniqueId: string) => apiHelper.get(`/technics/${techniqueId}`)

    getListTechnique = (page: number, size: number, search: string) =>
        apiHelper.get(`/technics`, {page, size, search})

    postNewTechnique = (technique: ITechniqueRequest) => apiHelper.post<ITechniqueRequest>(`/technics`, technique)

    putUpdateTechnique = (technique: ITechniqueRequest) =>
        apiHelper.put<ITechniqueRequest>(`/technics/${technique.id!}`, technique)

    deleteTechnique = (techniqueId: number) => apiHelper.delete(`/technics/${techniqueId}`)
}

const techniqueService = new TechniqueService()

export default techniqueService
