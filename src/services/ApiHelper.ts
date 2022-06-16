import api from "../utils/api";
import {ResponseType} from "axios";

interface ParamsInterface {
    page?: number;
    size?: number;
    search?: string;
    startDate?: string;
    endDate?: string;
    extraParams?: {
        [key: string]: string | number
    };
    type?: any;
    from?: string,
    to?: string,
    warehouseId?: number;
    responseType?: ResponseType;
    locationId?: number;
    barcode?: string;
}

class ApiHelper {
    get = (url: string, params?: ParamsInterface) => new Promise((resolve, reject) => {
        let extraParams = ''

        if (params?.extraParams) {
            extraParams = '?'

            for (const extraParamsKey in params.extraParams) {
                extraParams += `extraParams[${extraParamsKey}]=${params.extraParams[extraParamsKey]}&`
            }

            extraParams = encodeURI(extraParams.slice(0, -1))

            delete params.extraParams
        }

        let responseType = undefined;

        if (params?.responseType) {
            responseType = params.responseType
            delete params.responseType
        }

        api.get(url + extraParams, {params, responseType})
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    post = <DataType>(url: string, data?: DataType) => new Promise((resolve, reject) => {
        api.post(url, data)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    put = <DataType>(url: string, data?: DataType) => new Promise((resolve, reject) => {
        api.put(url, data)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })

    delete = (url: string) => new Promise((resolve, reject) => {
        api.delete(url)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    })
}

const apiHelper = new ApiHelper()

export default apiHelper