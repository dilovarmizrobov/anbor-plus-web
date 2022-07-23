import mock from '../utils/mock';
import {BASE_URL} from "../constants";

mock.onGet(new RegExp(`${BASE_URL}/warehouses/\\d`)).reply(200, {
    "id": 1,
    "name": "Sklad Norak",
    "enterpriseName": "ZAO EMZ"

})

mock.onGet(BASE_URL + '/warehouses').reply(200, [
    {
        "id": 1,
        "createdDate": "01.07.2022 06:53",
        "updatedDate": "01.07.2022 06:53",
        "name": "Sklad Norak",
        "enterpriseName": "ZAO EMZ"
    },
    {
        "id": 6,
        "createdDate": "13.07.2022 07:57",
        "updatedDate": "13.07.2022 07:57",
        "name": "Склад Роғун №2",
        "enterpriseName": "ЗАО ЭМЗ 2"
    },
    {
        "id": 7,
        "createdDate": "13.07.2022 07:58",
        "updatedDate": "13.07.2022 07:58",
        "name": "Склад Норак №3",
        "enterpriseName": "Туннел №9"
    }
])

mock.onPost(BASE_URL + '/warehouses').reply(201)

mock.onPut(new RegExp(`${BASE_URL}/warehouses/\\d`)).reply(202)

mock.onDelete(new RegExp(`${BASE_URL}/warehouses/\\d`)).reply(204)