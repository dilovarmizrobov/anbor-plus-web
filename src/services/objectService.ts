import apiHelper from "./ApiHelper";
import {IObject} from "../models/IObject";

class ObjectService {

    getObject = (objectId : string) => apiHelper.get(`/facilities/${objectId}`)

    getListObject = (page: number, size: number, search: string) =>
        apiHelper.get(`/facilities`, {search, size, page})

    postNewObject = (object: IObject) => apiHelper.post<IObject>(`/facilities`, object)

    putUpdateObject = (object : IObject) => apiHelper.put<IObject>(`/facilities/${object.id!}`, object)

    deleteObject = (objectId: number) => apiHelper.delete(`/facilities/${objectId}`)
}

const objectService = new ObjectService();

export default objectService;
