import apiHelper from "./ApiHelper";
import {IWarehouseRequest} from "../models/IWarehouse";

class WarehouseService {
    getWarehouse = (warehouseId: string) => apiHelper.get(`/warehouses/${warehouseId}`)

    getListWarehouse = () => apiHelper.get(`/warehouses`)

    getOptionWarehouses = () => apiHelper.get(`/warehouses/option`)

    postNewWarehouse = (warehouse: IWarehouseRequest) => apiHelper.post<IWarehouseRequest>(`/warehouses`, warehouse)

    putUpdateWarehouse = (warehouse: IWarehouseRequest) => apiHelper.put<IWarehouseRequest>(`/warehouses/${warehouse.id!}`, warehouse)

    deleteWarehouse = (warehouseId: number) => apiHelper.delete(`/warehouses/${warehouseId}`)
}

const warehouseService = new WarehouseService()

export default warehouseService