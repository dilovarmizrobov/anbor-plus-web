import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IDisplacementTotalInfo} from "../../models/Displacement";
import {IResListMaterial} from "../../models/Overhead";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    rowsCount: number;
    rows: IResListMaterial[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    displacementTotalInfo?: IDisplacementTotalInfo;
    updateDisplacementTotalInfo: boolean;
}

const initialStateList: initialStateListInterface = {
    page: 0,
    rowsPerPage: 20,
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
    displacementTotalInfo: undefined,
    updateDisplacementTotalInfo: false,
}

export const displacementMaterialListSlice = createSlice({
    name: 'displacementMaterialList',
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
            state.updateDisplacementTotalInfo = !state.updateDisplacementTotalInfo
        },
        setDisplacementTotalInfo: (state, action: PayloadAction<IDisplacementTotalInfo>) => {
            state.displacementTotalInfo = action.payload
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
    setDisplacementTotalInfo,
} = displacementMaterialListSlice.actions

export const selectDisplacementMaterialList = (state: RootState) => state.displacementMaterialList
