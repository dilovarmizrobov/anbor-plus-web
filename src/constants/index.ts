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

export enum IncomeTypeEnum {
    PROVIDER = "PROVIDER",
    FACILITY = "FACILITY",
    ENTERPRISE = "ENTERPRISE",
}

export const IncomeTypeMap = new Map(
    [
        [IncomeTypeEnum.PROVIDER, 'Снабженцы'],
        [IncomeTypeEnum.FACILITY, 'Объекты'],
        [IncomeTypeEnum.ENTERPRISE, 'Предприятия'],
    ]
)

export enum IncomeFilterPriceTypeEnum {
    CHANGED_PRICE = 'CHANGED_PRICE',
    WITHOUT_PRICE = 'WITHOUT_PRICE'
}

export const IncomeFilterPriceTypeMap = new Map(
    [
        [IncomeFilterPriceTypeEnum.WITHOUT_PRICE, 'Без цены'],
        [IncomeFilterPriceTypeEnum.CHANGED_PRICE, 'Измененная цена'],
    ]
)