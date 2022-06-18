import {IUser} from "../models/IUser";
import api from "../utils/api";
import {UserRolesEnum} from "../constants";

class AuthService {
    setAxiosInterceptors = (user: IUser, onLogout: VoidFunction) => {
        api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && error.response.status === 401) {
                    this.logout()
                    onLogout()
                }

                return Promise.reject(error);
            }
        )

        return api.interceptors.request.use((config) => {
            if ((user.role === UserRolesEnum.ADMIN || user.role === UserRolesEnum.ACCOUNTANT) && user.warehouse) {
                if (config.params) {
                    config.params.warehouseId = user.warehouse!.id
                } else {
                    config.params = {warehouseId: user.warehouse!.id}
                }
            }

            return config;
        }, (error) => {
            return Promise.reject(error);
        })
    }

    login = (login: string, password: string) => new Promise((resolve, reject) => {
        const params = new URLSearchParams()
        params.append('login', login)
        params.append('password', password)

        api.post('authenticate', params)
            .then((response) => {
                let data = response.data
                const user: IUser = {fullName: data.fullName, role: data.role}

                if (data.role === UserRolesEnum.ADMIN || data.role === UserRolesEnum.ACCOUNTANT) {
                    user.warehouse = data.warehouse || undefined
                }

                this.setUserAndJwtInSession(data.jwt, user)

                resolve(user)
            })
            .catch(error => reject(error))
    })

    logout = () => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
    }


    setUserAndJwtInSession = (jwt: string, user: IUser) => {
        localStorage.setItem('jwt', jwt)
        localStorage.setItem('user', JSON.stringify(user))
        api.defaults.headers.common.Authorization = `Bearer ${jwt}`
    }

    setAxiosAuthorization = () => api.defaults.headers.common.Authorization = `Bearer ${this.getJwtFromSession()}`
    getJwtFromSession = () => localStorage.getItem('jwt')
    getUserFromSession = () => JSON.parse(localStorage.getItem('user') as string) as IUser;
    isAuthenticated = () => Boolean(this.getJwtFromSession())
    setUserInSession = (user: IUser) => localStorage.setItem('user', JSON.stringify(user))
}

const authService = new AuthService()

export default authService
