import {IOutcomeTotalInfo} from "../../models/IOutcome";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IPriceHistory, IResListMaterial} from "../../models/Overhead";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    rowsCount: number;
    rows: IResListMaterial[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    isOpenHistoryModal: boolean,
    priceHistory?: IPriceHistory[],
    isOpenEditPriceModal: boolean;
    materialEditPriceId: number;
    materialEditPrice: number;
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
    isOpenHistoryModal: false,
    isOpenEditPriceModal: false,
    materialEditPriceId: 0,
    materialEditPrice: 0,
    outcomeTotalInfo: undefined,
    updateOutcomeTotalInfo: false,
}

export const outcomeMaterialListSlice = createSlice({
    name: 'outcomeMaterialList',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        setPriceHistory: (state, action: PayloadAction<IPriceHistory[]>) => {
            state.priceHistory = action.payload
            state.isOpenHistoryModal = true
        },
        closeHistoryModal: (state) => {
            state.isOpenHistoryModal = false
        },
        setMaterialEditPrice: (state, action: PayloadAction<{price: number, materialId: number}>) => {
            state.materialEditPrice = action.payload.price
            state.materialEditPriceId = action.payload.materialId
            state.isOpenEditPriceModal = true
        },
        closeEditPriceModal: (state) => {
            state.isOpenEditPriceModal = false
        },
        editMaterial: (state, action: PayloadAction<IResListMaterial>) => {
            let index = state.rows.findIndex(row => row.id === action.payload.id)

            state.rows[index] = action.payload
            state.isOpenEditPriceModal = false
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
    setPriceHistory,
    closeHistoryModal,
    setMaterialEditPrice,
    closeEditPriceModal,
    getListPending,
    getListSuccess,
    getListError,
    editMaterial,
    setOutcomeTotalInfo,
} = outcomeMaterialListSlice.actions

export const selectOutcomeMaterialList = (state: RootState) => state.outcomeMaterialList
