import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {RootState} from "../index";
import { IResWarehouseBalance } from "../../models";

interface InitialState {
    page: number;
    rowsPerPage: number;
    rowsCount: number;
    rows: IResWarehouseBalance[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    filterCategoryId?: number;
}

const initialState: InitialState = {
    page: 0,
    rowsPerPage: 20,
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
}

export const warehouseBalanceSlice = createSlice({
    name: 'warehouseBalance',
    initialState,
    reducers: {
        reset: () => initialState,
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
        getListSuccess: (state, action: PayloadAction<{ rows: IResWarehouseBalance[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
        },
        setFilterCategoryId: (state, action: PayloadAction<number | undefined>) => {
            state.filterCategoryId = action.payload
        },
    }
})

export const {
    reset,
    changePage,
    changeRowsPerPage,
    getListPending,
    getListSuccess,
    getListError,
    setFilterCategoryId,
} = warehouseBalanceSlice.actions

export const selectWarehouseBalance = (state: RootState) => state.warehouseBalance
