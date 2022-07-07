import {IOutcomeListResponse} from "../../models/IOutcome";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {OutcomeFilterPriceTypeEnum, OutcomeUnitEnum} from "../../constants";


interface initialStateListInterface {
    startDate?: string,
    endDate?: string,
    page: number;
    rowsPerPage: number;
    query: string;
    rowsCount: number;
    rows: IOutcomeListResponse[];
    rowsLoading: boolean;
    rowsError: boolean;
    rowsPerPageOptions: number[],
    filterPriceType?: OutcomeFilterPriceTypeEnum;
    filterOutcomeType?: OutcomeUnitEnum;
    filterOutcomeFromWho?: string;
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

export const outcomeListSlice = createSlice({
    name: 'outcomeList',
    initialState: initialStateList,
    reducers: {
        reset: (state) => {
            let keys = Object.keys(initialStateList) as Array<never>
            for (let i = 0; i < keys.length; i++) {
                state[keys[i]] = initialStateList[keys[i]]
            }
        },
        changeStartDate: (state, action: PayloadAction<string | undefined>) => {
            state.startDate = action.payload
            state.page = 0
        },
        changeEndDate: (state, action: PayloadAction<string | undefined>) => {
            state.endDate = action.payload
            state.page = 0
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        changeRowsPerPage: (state, action: PayloadAction<number>) => {
            state.rowsPerPage = action.payload;
            state.page = 0;
        },
        setFilterPriceType: (state, action: PayloadAction<OutcomeFilterPriceTypeEnum>) => {
            state.filterPriceType = state.filterPriceType === action.payload ? undefined : action.payload
            state.page = 0;
        },
        setFilterOutcomeType: (state, action: PayloadAction<OutcomeUnitEnum | undefined>) => {
            state.filterOutcomeType = action.payload
        },
        setFilterOutcomeFromWho: (state, action: PayloadAction<string | undefined>) => {
            state.filterOutcomeFromWho = action.payload
        },
        getListPending: (state) => {
            state.rows = [];
            state.rowsLoading = true;
            state.rowsError = false;
        },
        getListSuccess: (state, action: PayloadAction<{ rows: IOutcomeListResponse[], rowsCount: number }>) => {
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
    changeStartDate,
    changeEndDate,
    changePage,
    changeRowsPerPage,
    setFilterPriceType,
    setFilterOutcomeFromWho,
    setFilterOutcomeType,
    getListPending,
    getListSuccess,
    getListError,
    deleteRow
} = outcomeListSlice.actions

export const selectOutcomeList = (state: RootState) => state.outcomeList
