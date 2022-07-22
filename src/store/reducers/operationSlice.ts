import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IResListMaterial, IResListOperation, IResTotalInfo} from "../../models/Operation";
import {RootState} from "../index";

interface IInitialStateList {
    query: string;
    page: number;
    rowsPerPage: number;
    rowsCount: number;
    rows: IResListOperation[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
}

const initialStateList: IInitialStateList = {
    query: '',
    page: 0,
    rowsPerPage: 20,
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
}

export const operationListSlice = createSlice({
    name: 'operationList',
    initialState: initialStateList,
    reducers: {
        reset: () => initialStateList,
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
        getListPending: (state) => {
            state.rows = [];
            state.rowsLoading = true;
            state.rowsError = false;
        },
        getListSuccess: (state, action: PayloadAction<{ rows: IResListOperation[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
        },
    }
})

export const {
    reset,
    changeQuery,
    changePage,
    changeRowsPerPage,
    getListPending,
    getListSuccess,
    getListError,
} = operationListSlice.actions

export const selectOperationList = (state: RootState) => state.operationList

const initialStateOperationMaterialList = {
    page: 0,
    rowsPerPage: 30,
    rowsCount: 0,
    rows: [] as IResListMaterial[],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [30, 50, 100],
    totalInfo: undefined as (IResTotalInfo | undefined),
    updateTotalInfo: false,
}

export const operationMaterialListSlice = createSlice({
    name: 'operationMaterialList',
    initialState: initialStateOperationMaterialList,
    reducers: {
        reset: () => initialStateOperationMaterialList,
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        editMaterial: (state, action: PayloadAction<IResListMaterial>) => {
            let index = state.rows.findIndex(row => row.id === action.payload.id)

            state.rows[index] = action.payload
            state.updateTotalInfo = !state.updateTotalInfo
        },
        setTotalInfo: (state, action: PayloadAction<IResTotalInfo>) => {
            state.totalInfo = action.payload
        },
        getListPending: (state) => {
            state.rows = [];
            state.rowsLoading = true;
            state.rowsError = false;
        },
        getListSuccess: (state, action: PayloadAction<{ rows: IResListMaterial[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
        },
    }
})

export const operationMaterialListActions = operationMaterialListSlice.actions
export const selectOperationMaterialList = (state: RootState) => state.operationMaterialList
