import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUserResponse} from "../../models/IUser";
import {RootState} from "../index";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    query: string;
    rowsLoading: boolean;
    rowsError: boolean;
    rows: IUserResponse[];
    rowsCount: number;
    rowsPerPageOptions: number[],
    rowsUpdate: boolean;
}

const initialStateList: initialStateListInterface = {
    page: 0,
    rowsPerPage: 20,
    query: '',
    rowsLoading: false,
    rowsError: false,
    rows: [],
    rowsCount: 0,
    rowsPerPageOptions: [20, 30, 50],
    rowsUpdate: true,
}

export const userListSlice = createSlice({
    name: 'userList',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>

            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        changeQuery: (state, action: PayloadAction<string>) => {
            state.page = 0
            state.query = action.payload
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload
            state.page = 0
        },
        getListUsersPending: (state) => {
            state.rows = []
            state.rowsLoading = true
            state.rowsError = false
        },
        getListUsersSuccess: (state, action: PayloadAction<{ rows: IUserResponse[], rowsCount: number }>) => {
            state.rows = action.payload.rows
            state.rowsCount = action.payload.rowsCount
            state.rowsLoading = false
        },
        getListUsersError: (state) => {
            state.rowsLoading = false
            state.rowsError = true
        },
        deleteRow: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id === action.payload)
            state.rows.splice(index, 1)
            state.rowsUpdate = !state.rowsUpdate
        }
    }
})

export const {
    reset,
    changePage,
    changeRowsPerPage,
    changeQuery,
    getListUsersPending,
    getListUsersSuccess,
    getListUsersError,
    deleteRow,
} = userListSlice.actions

export const selectUserList = (state: RootState) => state.userList
