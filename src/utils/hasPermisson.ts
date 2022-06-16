import {IUser} from "../models/IUser";

export default function hasPermission(permissions: string[]) {
    const localUser = localStorage.getItem('user')

    if (localUser === null) return false

    const user = JSON.parse(localUser) as IUser

    return permissions.indexOf(user.role) > -1;
}