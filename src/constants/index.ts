export const BASE_URL = '/anbor'

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
