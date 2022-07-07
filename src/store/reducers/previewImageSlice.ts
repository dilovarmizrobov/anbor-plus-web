import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface initialStateInterface {
    previewImageUrl?: string;
}

const initialState: initialStateInterface = {}

export const previewImageSlice = createSlice({
    name: 'previewImage',
    initialState,
    reducers: {
        setPreviewImageUrl: (state, action: PayloadAction<string | undefined>) => {
            state.previewImageUrl = action.payload
        },
    }
})

export const {setPreviewImageUrl} = previewImageSlice.actions

export const selectPreviewImage = (state: RootState) => state.previewImage
