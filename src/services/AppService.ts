import apiHelper from "./ApiHelper";

class AppService {
    getOptionCategories = () => apiHelper.get(`/categories/option`)

    getListWarehouseBalance = (page: number, size: number, search: string, categoryId?: number) => 
    apiHelper.get(`/warehouses/balance`, {page, size, search, extraParams: categoryId ? {categoryId} : {}})
}

const appService = new AppService()

export default appService;
