import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./reducers/authSlice"
import {userListSlice} from "./reducers/userSlice";
import {objectListSlice} from './reducers/objectSlice';
import {warehouseListSlice} from "./reducers/warehouseSlice";
import {enterpriseListSlice} from "./reducers/enterpriseSlice";
import {providerListSlice} from "./reducers/providerSlice";
import {materialListSlice} from "./reducers/materialSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userList: userListSlice.reducer,
        objectList: objectListSlice.reducer,
        warehouseList: warehouseListSlice.reducer,
        enterpriseList: enterpriseListSlice.reducer,
        providerList: providerListSlice.reducer,
        materialList: materialListSlice.reducer,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
