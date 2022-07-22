import mock from '../utils/mock';
import {BASE_URL} from "../constants";

mock.onGet(BASE_URL + '/overheads/all/operation').reply(200, {
    "content": [
        {
            "id": 2,
            "createdDate": "16.07.2022 06:30",
            "updatedDate": "16.07.2022 06:30",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "INVENTORY",
            "warehouse": "склад Норак",
            "responsible": "234",
            "approved": true,
            "imageNames": [],
        },
        {
            "id": 7,
            "createdDate": "18.07.2022 05:05",
            "updatedDate": "18.07.2022 05:05",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "WRITEOFF",
            "warehouse": "склад Рогун №2",
            "responsible": "234",
            "approved": false,
            "imageNames": [],
        },
        {
            "id": 1,
            "createdDate": "16.07.2022 06:28",
            "updatedDate": "16.07.2022 06:28",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "WRITEOFF",
            "warehouse": "склад Рогун №2",
            "responsible": "234",
            "approved": false,
            "imageNames": [],
        },
        {
            "id": 6,
            "createdDate": "16.07.2022 06:35",
            "updatedDate": "16.07.2022 06:35",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "WRITEOFF",
            "warehouse": "склад Рогун №2",
            "responsible": "234",
            "approved": false,
            "imageNames": [],
        },
        {
            "id": 5,
            "createdDate": "16.07.2022 06:35",
            "updatedDate": "16.07.2022 06:35",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "WRITEOFF",
            "warehouse": "склад Норак",
            "responsible": "234",
            "approved": true,
            "imageNames": [],
        },
        {
            "id": 3,
            "createdDate": "16.07.2022 06:30",
            "updatedDate": "16.07.2022 06:30",
            "act": "234",
            "categories": ["ГСМ", "Инструменты", "Металлы"],
            "type": "WRITEOFF",
            "warehouse": "склад Норак",
            "responsible": "234",
            "approved": false,
            "imageNames": [],
        }
    ],
    "pageable": {
        "sort": {
            "sorted": true,
            "unsorted": false,
            "empty": false
        },
        "pageNumber": 0,
        "pageSize": 20,
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 6,
    "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
    },
    "first": true,
    "number": 0,
    "numberOfElements": 6,
    "size": 20,
    "empty": false
})

mock.onGet(new RegExp(`${BASE_URL}/overheads/\\d/items`)).reply(200, {
    "content": [
        {
            "id": 6,
            "material": "Арматура",
            "mark": "А32",
            "sku": "96459948754",
            "balance": 60,
            "unit": "TON",
            "qty": 20,
            "price": 2000,
            "total": 120000,
            "priceHistory": [
                {
                    "id": 6,
                    "createdBy": "Мизробов Дилшод",
                    "createdDate": "16.07.2022 06:43",
                    "price": 2000,
                    "comment": ""
                }
            ]
        },
        {
            "id": 5,
            "material": "Арматура",
            "mark": "А12",
            "sku": "12323к348",
            "balance": 50,
            "unit": "TON",
            "qty": 20,
            "price": 200,
            "total": 10000,
            "priceHistory": [
                {
                    "id": 7,
                    "createdBy": "Мизробов Дилшод",
                    "createdDate": "16.07.2022 06:43",
                    "price": 150.56,
                    "comment": ""
                },
                {
                    "id": 13,
                    "createdBy": "Манучехр Рачабов",
                    "createdDate": "20.07.2022 07:16",
                    "price": 200,
                    "comment": ""
                }
            ]
        },
        {
            "id": 11,
            "material": "Бензин",
            "mark": "АИ-95",
            "sku": "0019879879",
            "balance": 50,
            "unit": "LITRE",
            "qty": 10,
            "priceHistory": []
        }
    ],
    "pageable": {
        "sort": {
            "sorted": true,
            "unsorted": false,
            "empty": false
        },
        "pageNumber": 0,
        "pageSize": 20,
        "offset": 0,
        "paged": true,
        "unpaged": false
    },
    "last": true,
    "totalPages": 1,
    "totalElements": 2,
    "sort": {
        "sorted": true,
        "unsorted": false,
        "empty": false
    },
    "first": true,
    "number": 0,
    "numberOfElements": 2,
    "size": 20,
    "empty": false
})

mock.onGet(new RegExp(`${BASE_URL}/overheads/\\d/total-info`)).reply(200, {
    "type": "INVENTORY",
    "approved": false,
    "total": 1235
})