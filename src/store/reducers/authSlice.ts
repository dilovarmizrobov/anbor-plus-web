import {IUser} from "../../models/IUser";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import authService from "../../services/AuthService";
import {IWarehouseOption} from "../../models/IWarehouse";

interface initialStateInterface {
    user: IUser | null;
    isAuthenticated: boolean;
}

const initialState: initialStateInterface = {
    user: null,
    isAuthenticated: false,
}

if (authService.isAuthenticated()) {
    const user = authService.getUserFromSession()
    authService.setAxiosAuthorization()

    initialState.user = user
    initialState.isAuthenticated = true
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },
        logout: (state) => {
            authService.logout()
            state.user = null
            state.isAuthenticated = false
        },
        updateWarehouse: (state, action: PayloadAction<IWarehouseOption>) => {
            state.user!.warehouse = action.payload
            authService.setUserInSession(state.user!)
        }
    }
})

export const {login, logout, updateWarehouse} = authSlice.actions

export const selectAuth = (state: RootState) => state.auth

export default authSlice.reducer
