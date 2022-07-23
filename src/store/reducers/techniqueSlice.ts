import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {ITechniqueResponse} from "../../models/ITechnique";

interface initialStateListInterface {
    page: number;
    rowsPerPage: number;
    query: string;
    rowsCount: number;
    rows: ITechniqueResponse[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
}

const initialStateList: initialStateListInterface = {
    page: 0,
    rowsPerPage: 20,
    query: '',
    rowsCount: 0,
    rows: [],
    rowsLoading: false,
    rowsError: false,
    rowsPerPageOptions: [20, 30, 50],
}

export const techniqueListSlice = createSlice({
    name: 'technique',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
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
        getListSuccess: (state, action: PayloadAction<{ rows: ITechniqueResponse[], rowsCount: number }>) => {
            state.rows = action.payload.rows;
            state.rowsCount = action.payload.rowsCount;
            state.rowsLoading = false;
        },
        getListError: (state) => {
            state.rowsError = true;
            state.rowsLoading = false;
        },
        deleteRow: (state, action: PayloadAction<number>) => {
            let index = state.rows.findIndex(row => row.id === action.payload)
            state.rows.splice(index, 1)
        }
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
    deleteRow
} = techniqueListSlice.actions

export const selectTechnique = (state: RootState) => state.techniqueList
