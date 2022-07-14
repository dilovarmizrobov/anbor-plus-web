import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {IOverheadMaterial} from "../../models/Overhead";

interface IInitialState {
    materials: IOverheadMaterial[];
    openModal: boolean;
    material?: IOverheadMaterial;
    materialIndex?: number;
    materialDuplicate: number;
}

const initialState: IInitialState = {
    materials: [],
    openModal: false,
    materialDuplicate: 0,
}

export const overheadMaterialSlice = createSlice({
    name: 'overheadMaterial',
    initialState,
    reducers: {
        reset: () => initialState,
        setOverheadMaterials: (state, action: PayloadAction<IOverheadMaterial[]>) => {
            state.materials = action.payload
        },
        setOpenModal: (state, action: PayloadAction<boolean>) => {
            state.openModal = action.payload
        },
        addMaterial: (state, action: PayloadAction<IOverheadMaterial>) => {
            let newMaterial = action.payload
            let duplicate = state.materials.find(item => item.materialId === newMaterial.materialId && item.markId === newMaterial.markId)

            if (duplicate) state.materialDuplicate = ++state.materialDuplicate
            else state.materials.push(newMaterial)
        },
        editMaterial: (state, action: PayloadAction<IOverheadMaterial>) => {
            let newMaterial = action.payload
            let duplicate = state.materials.find(item => item.materialId === newMaterial.materialId && item.markId === newMaterial.markId)

            if (duplicate && duplicate.id !== state.material?.id) state.materialDuplicate = ++state.materialDuplicate
            else state.materials[state.materialIndex!] = action.payload
        },
        handleAddMaterial: (state) => {
            state.openModal = true
            state.material = undefined;
            state.materialIndex = undefined
        },
        handleEditMaterial: (state, action: PayloadAction<{index: number, material: IOverheadMaterial}>) => {
            state.openModal = true
            state.material = action.payload.material
            state.materialIndex = action.payload.index
        },
        deleteMaterial: (state, action: PayloadAction<string>) => {
            let index = state.materials.findIndex(mat => mat.mark!.sku === action.payload)
            state.materials.splice(index, 1)
        }
    }
})

export const {reset, setOverheadMaterials, deleteMaterial, handleEditMaterial, handleAddMaterial,
    setOpenModal, addMaterial, editMaterial} = overheadMaterialSlice.actions

export const selectOverheadMaterial = (state: RootState) => state.overheadMaterial