import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./reducers/authSlice"
import {userListSlice} from "./reducers/userSlice";
import {objectListSlice} from './reducers/objectSlice';
import {warehouseListSlice} from "./reducers/warehouseSlice";
import {enterpriseListSlice} from "./reducers/enterpriseSlice";
import {providerListSlice} from "./reducers/providerSlice";
import {materialListSlice} from "./reducers/materialSlice";
import {incomeListSlice} from "./reducers/incomeSlice";
import {incomeMaterialListSlice} from "./reducers/incomeMaterialSlice";
import { warehouseBalanceSlice } from './reducers/warehouseBalanceSlice';
import {outcomeListSlice} from "./reducers/outcomeSlice";
import {outcomeMaterialListSlice} from "./reducers/outcomeMaterialListSlice";
import {previewImageSlice} from "./reducers/previewImageSlice";
import {overheadMaterialSlice} from "./reducers/overheadMaterialSlice";
import {displacementListSlice} from "./reducers/displacementSlice";
import {displacementMaterialListSlice} from "./reducers/displacementMaterialSlice";
import {operationListSlice, operationMaterialListSlice} from "./reducers/operationSlice";
import {materialPriceHistorySlice} from "./reducers/materialPriceHistorySlice";
import {materialPriceEditSlice} from "./reducers/materialPriceEditSlice";
import {tableSearchSlice} from "./reducers/tableSearchSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        previewImage: previewImageSlice.reducer,
        userList: userListSlice.reducer,
        objectList: objectListSlice.reducer,
        warehouseList: warehouseListSlice.reducer,
        enterpriseList: enterpriseListSlice.reducer,
        providerList: providerListSlice.reducer,
        materialList: materialListSlice.reducer,
        incomeList: incomeListSlice.reducer,
        incomeMaterialList: incomeMaterialListSlice.reducer,
        warehouseBalance: warehouseBalanceSlice.reducer,
        outcomeList: outcomeListSlice.reducer,
        outcomeMaterialList: outcomeMaterialListSlice.reducer,
        overheadMaterial: overheadMaterialSlice.reducer,
        displacementList: displacementListSlice.reducer,
        displacementMaterialList: displacementMaterialListSlice.reducer,
        operationList: operationListSlice.reducer,
        operationMaterialList: operationMaterialListSlice.reducer,
        materialPriceHistory: materialPriceHistorySlice.reducer,
        materialPriceEdit: materialPriceEditSlice.reducer,
        tableSearch: tableSearchSlice.reducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
