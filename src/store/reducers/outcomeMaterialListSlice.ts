import {IOutcomeTotalInfo} from "../../models/IOutcome";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IResListMaterial} from "../../models/Overhead";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    rowsCount: number;
    rows: IResListMaterial[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    outcomeTotalInfo?: IOutcomeTotalInfo;
    updateOutcomeTotalInfo: boolean;
}

const initialStateList: initialStateListInterface = {
    page: 0,
    rowsPerPage: 20,
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
    outcomeTotalInfo: undefined,
    updateOutcomeTotalInfo: false,
}

export const outcomeMaterialListSlice = createSlice({
    name: 'outcomeMaterialList',
    initialState: initialStateList,
    reducers: {
        reset: () => initialStateList,
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
            state.updateOutcomeTotalInfo = !state.updateOutcomeTotalInfo
        },
        setOutcomeTotalInfo: (state, action: PayloadAction<IOutcomeTotalInfo>) => {
            state.outcomeTotalInfo = action.payload
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

export const {
    reset,
    changePage,
    changeRowsPerPage,
    getListPending,
    getListSuccess,
    getListError,
    editMaterial,
    setOutcomeTotalInfo,
} = outcomeMaterialListSlice.actions

export const selectOutcomeMaterialList = (state: RootState) => state.outcomeMaterialList
