import {IEnterpriseResponse} from "../../models/IEnterprise";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    query: string;
    rowsCount: number;
    rows: IEnterpriseResponse[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    rowsUpdate: boolean;
}

const initialStateList: initialStateListInterface = {
    page: 0,
    rowsPerPage: 20,
    query: '',
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
    rowsUpdate: true
}

export const enterpriseListSlice = createSlice({
    name: 'enterprise',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        changeQuery: (state, action: PayloadAction<string>) => {
            state.page = 0;
            state.query = action.payload;
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        getListEnterprisePending: (state) => {
            state.rows = [];
            state.rowsLoading = true;
            state.rowsError = false;
        },
        getListEnterpriseSuccess: (state, action: PayloadAction<{ rows: IEnterpriseResponse[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListEnterpriseError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
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
    changeQuery,
    changePage,
    changeRowsPerPage,
    getListEnterprisePending,
    getListEnterpriseSuccess,
    getListEnterpriseError,
    deleteRow
} = enterpriseListSlice.actions

export const selectEnterprise = (state: RootState) => state.enterpriseList
