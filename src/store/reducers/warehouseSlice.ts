import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IWarehouseResponse} from "../../models/IWarehouse";

interface initialStateListInterface {
    rowsLoading: boolean;
    rowsError: boolean;
    rows: IWarehouseResponse[];
}

const initialStateList: initialStateListInterface = {
    rowsLoading: false,
    rowsError: false,
    rows: [],
}

export const warehouseListSlice = createSlice({
    name: 'warehouseList',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>

            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        getListWarehousePending: (state) => {
            state.rows = []
            state.rowsLoading = true
            state.rowsError = false
        },
        getListWarehouseSuccess: (state, action: PayloadAction<IWarehouseResponse[]>) => {
            state.rows = action.payload
            state.rowsLoading = false
        },
        getListWarehouseError: (state) => {
            state.rowsLoading = false
            state.rowsError = true
        },
        deleteRow: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id === action.payload)
            state.rows.splice(index, 1)
        }
    }
})

export const {
    reset,
    getListWarehousePending,
    getListWarehouseSuccess,
    getListWarehouseError,
    deleteRow,
} = warehouseListSlice.actions

export const selectWarehouseList = (state: RootState) => state.warehouseList
