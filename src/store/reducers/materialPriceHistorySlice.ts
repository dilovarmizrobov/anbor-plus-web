import {IPriceHistory} from "../../models/Overhead";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface IInitialState {
    priceHistory: undefined | IPriceHistory[];
    isOpen: boolean;
}

const initialState: IInitialState = {
    priceHistory: undefined,
    isOpen: false,
}

export const materialPriceHistorySlice = createSlice({
    name: 'materialPriceHistory',
    initialState,
    reducers: {
        openPriceHistory: (state, action: PayloadAction<IPriceHistory[]>) => {
            state.priceHistory = action.payload
            state.isOpen = true
        },
        closePriceHistory: (state) => {
            state.priceHistory = undefined
            state.isOpen = false
        },
    }
})

export const {openPriceHistory, closePriceHistory} = materialPriceHistorySlice.actions
export const selectMaterialPriceHistory = (state: RootState) => state.materialPriceHistory