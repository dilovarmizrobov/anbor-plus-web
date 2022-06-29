import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IIncomeListResponse} from "../../models/IIncome";

interface initialStateListInterface {
    startDate?: string,
    endDate?: string,
    page: number;
    rowsPerPage: number;
    query: string;
    rowsCount: number;
    rows: IIncomeListResponse[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
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
}

export const incomeListSlice = createSlice({
    name: 'incomeList',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        changeStartDate: (state, action: PayloadAction<string | undefined>) => {
            state.startDate = action.payload
            state.page = 0
        },
        changeEndDate: (state, action: PayloadAction<string | undefined>) => {
            state.endDate = action.payload
            state.page = 0
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        getListPending: (state) => {
            state.rows = [];
            state.rowsLoading = true;
            state.rowsError = false;
        },
        getListSuccess: (state, action: PayloadAction<{ rows: IIncomeListResponse[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
        },
        deleteRow: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id === action.payload)
            state.rows.splice(index, 1)
        }
    }
})

export const {
    reset,
    changeStartDate,
    changeEndDate,
    changePage,
    changeRowsPerPage,
    getListPending,
    getListSuccess,
    getListError,
    deleteRow
} = incomeListSlice.actions

export const selectIncomeList = (state: RootState) => state.incomeList
