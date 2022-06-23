import apiHelper from "./ApiHelper";
import {IMaterialRequest} from "../models/IMaterial";

class MaterialService {
    getMaterial = (materialId: string) => apiHelper.get(`/materials/${materialId}`)

    getListMaterial = (page: number, size: number, search: string) =>
        apiHelper.get(`/materials`, {search, size, page})

    getOptionCategories = () => apiHelper.get(`/categories/option`)

    postNewMaterial = (material: IMaterialRequest) => apiHelper.post<IMaterialRequest>(`/materials`, material)

    putUpdateMaterial = (material: IMaterialRequest) => apiHelper.put<IMaterialRequest>(`/materials/${material.id!}`, material)

    deleteMaterial = (materialId: number) => apiHelper.delete(`/materials/${materialId}`)
}

const materialService = new MaterialService()

export default materialService