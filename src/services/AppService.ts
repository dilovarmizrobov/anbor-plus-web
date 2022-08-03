import apiHelper from "./ApiHelper";
import {IReqPriceEdit} from "../models/Overhead";

class AppService {
    getOptionWarehouses = () => apiHelper.get(`/warehouses/option`)

    getOptionCategories = () => apiHelper.get(`/categories/option`)

    getListWarehouseBalance = (page: number, size: number, search: string, categoryId?: number) =>
        apiHelper.get(`/warehouses/balance`, {page, size, search, extraParams: categoryId ? {categoryId} : {}})

    getOptionMaterials = (query: string) => apiHelper.get(`/materials/find`, {search: query})

    getOptionMarks = (materialId: number) => apiHelper.get(`/materials/marks/${materialId}`)

    getListOverheadMaterial = (overheadId: string, page: number, size: number, ) =>
        apiHelper.get(`/overheads/${overheadId}/items`, {size, page, })

    getPrintOverhead = (overheadIds: number) =>
        apiHelper.get(`/overheads/excel/${overheadIds}`)

    getDownloadOverhead = (fileName: string) =>
        apiHelper.get(`/overheads/excel/download/${fileName}`, {responseType: "blob"})

    putMaterialPriceEdit = (priceEdit: IReqPriceEdit) => apiHelper.put<IReqPriceEdit>('/overheads/change-item-price', priceEdit)


}

const appService = new AppService()

export default appService;
