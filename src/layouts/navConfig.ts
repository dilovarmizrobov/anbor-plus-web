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
                title: 'Пользователи',
                icon: FaUserFriends,
                href: '/users',
                perm: PERMISSIONS.LIST.USER,
            },
            {
                title: 'Home',
                icon: FaUserFriends,
                href: '/home',
            },
            {
                title: 'Настройки',
                icon: MdSettings,
                children: [
                    {
                        title: 'Склады',
                        href: '/settings/warehouse',
                    },
                    {
                        title: 'Обьекты',
                        href: '/settings/objects',
                    },
                ],
            },
        ]
    },
]