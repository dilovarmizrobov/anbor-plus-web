export const BASE_URL = '/anbor'
export const PATH_OVERHEADS_IMAGE = '/anbor/overheads/load-image/'


export enum UserRolesEnum {
    ADMIN = "ADMIN",
    WAREHOUSEMAN = "WAREHOUSEMAN",
    ACCOUNTANT = "ACCOUNTANT"
}

export const UserRolesMap = new Map(
    [
        [UserRolesEnum.ADMIN, 'Админ'],
        [UserRolesEnum.WAREHOUSEMAN, 'Завсклад'],
        [UserRolesEnum.ACCOUNTANT, 'Материальный бухгалтер'],
    ]
)

export enum MaterialUnitEnum {
    TON = "TON",
    THING = "THING",
    LITRE = "LITRE",
}

export const MaterialUnitMap = new Map(
    [
        [MaterialUnitEnum.TON, 'тонна'],
        [MaterialUnitEnum.THING, 'шт'],
        [MaterialUnitEnum.LITRE, 'литр'],
    ]
)

export enum OutcomeUnitEnum {
    FACILITY = "FACILITY",
    ENTERPRISE = "ENTERPRISE"
}

export const OutcomeUnitMap = new Map(
    [
        [OutcomeUnitEnum.FACILITY, 'Обьект'],
        [OutcomeUnitEnum.ENTERPRISE, 'Предприятия']
    ]
)

export enum OverheadTypeEnum {
    OUTCOME = "OUTCOME",
    INCOME = "INCOME"
}

export enum OutcomeFilterPriceTypeEnum {
    CHANGED_PRICE = 'CHANGED_PRICE',
    WITHOUT_PRICE = 'WITHOUT_PRICE'
}

export const OutcomeFilterPriceTypeMap = new Map(
    [
        [OutcomeFilterPriceTypeEnum.WITHOUT_PRICE, 'Без цены'],
        [OutcomeFilterPriceTypeEnum.CHANGED_PRICE, 'Измененная цена'],
    ]
)
