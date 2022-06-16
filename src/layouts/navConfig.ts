import {FaUserFriends, FaUsers} from "react-icons/fa";
// import PERMISSIONS from "../constants/permissions";
import {IconType} from "react-icons";
import {UserRolesEnum} from "../constants";
import PERMISSIONS from "../constants/permissions";

export interface INavItem {
    title: string;
    icon: IconType;
    href: string;
    perm?: UserRolesEnum[];
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
                icon: FaUsers,
                href: '/home',
            },
            {
                title: 'Пользователи',
                icon: FaUserFriends,
                href: '/users',
                perm: PERMISSIONS.LIST.USER,
            },
        ]
    },
]