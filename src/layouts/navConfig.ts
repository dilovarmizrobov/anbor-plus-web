import {MdSettings} from "react-icons/md";
import {FaUserFriends} from "react-icons/fa";
import {IconType} from "react-icons";
import {UserRolesEnum} from "../constants";
import PERMISSIONS from "../constants/permissions";

export interface INavItem {
    title: string;
    icon?: IconType;
    href?: string;
    perm?: UserRolesEnum[];
    children?: INavItem[]
}

export interface INavConfig {
    subheader: string;
    items: INavItem[]
}

export const navConfigMain: INavConfig[] = [
    {
        subheader: 'Главная',
        items: [
            {
                title: 'Home',
                icon: FaUserFriends,
                href: '/home',
            },
            {
                title: 'Расходы',
                icon: FaUserFriends,
                href: '/outcomes',
            },
            {
                title: 'Приходы',
                icon: FaUserFriends,
                href: '/incomes',
            },
            {
                title: 'Остаток',
                icon: FaUserFriends,
                href: '/warehouse-balance',
            },
            {
                title: 'Перемещение',
                icon: FaUserFriends,
                href: '/displacements',
            },
            {
                title: 'Операции',
                icon: FaUserFriends,
                href: '/operations',
            },
            {
                title: 'Настройки',
                icon: MdSettings,
                perm: PERMISSIONS.LIST.USER,
                children: [
                    {
                        title: 'Пользователи',
                        href: '/users',
                        perm: PERMISSIONS.LIST.USER,
                    },
                    {
                        title: 'Материалы',
                        href: '/materials',
                    },
                    {
                        title: 'Склады',
                        href: '/warehouses',
                    },
                    {
                        title: 'Обьекты',
                        href: '/objects',
                    },
                    {
                        title: 'Предприятия',
                        href: '/enterprises',
                    },
                    {
                        title: 'Снабженцы',
                        href: '/providers'
                    }
                ],
            },
        ]
    },
]
