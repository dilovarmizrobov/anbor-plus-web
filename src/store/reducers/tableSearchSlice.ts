import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";

interface IInitialState {
    query: string;
}

const initialState: IInitialState = {
    query: ''
}

export const tableSearchSlice = createSlice({
    name: 'tableSearch',
    initialState,
    reducers: {
        reset: () => initialState,
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload
        }
    }
})

export const {reset, setQuery} = tableSearchSlice.actions

export const selectTableSearch = (state: RootState) => state.tableSearch