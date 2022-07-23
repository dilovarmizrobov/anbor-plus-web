import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface IInitialState {
    isOpenMaterialPriceEditModal: boolean,
    materialId: number,
    materialPrice: number,
}

const initialState: IInitialState = {
    isOpenMaterialPriceEditModal: false,
    materialId: 0,
    materialPrice: 0,
}

export const materialPriceEditSlice = createSlice({
    name: 'materialPriceEdit',
    initialState,
    reducers: {
        openMaterialPriceEditModal: (state, action: PayloadAction<{price: number, materialId: number}>) => {
            state.materialPrice = action.payload.price
            state.materialId = action.payload.materialId
            state.isOpenMaterialPriceEditModal = true
        },
        closeMaterialPriceEditModal: (state) => {
            state.isOpenMaterialPriceEditModal = false
            state.materialId = 0
            state.materialPrice = 0
        },
    }
})

export const {openMaterialPriceEditModal, closeMaterialPriceEditModal} = materialPriceEditSlice.actions
export const selectMaterialPriceEdit = (state: RootState) => state.materialPriceEdit