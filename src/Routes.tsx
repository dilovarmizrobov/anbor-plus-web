import React from 'react';
import {UserRolesEnum} from "./constants";
import {RouteObject, useRoutes} from "react-router-dom";
import HomePageView from "./views/HomePageView";
import Error404View from "./views/Error404View";
import LoginView from "./views/auth/LoginView";
import IndexRedirectGuard from "./components/IndexRedirectGuard";
import AuthGuard from "./components/AuthGuard";
import MainLayout from "./layouts/MainLayout";
import hasPermission from "./utils/hasPermisson";
import UsersListView from "./views/user/list/UsersListView";
import UserCreateView from "./views/user/form/UserCreateView";
import UserEditView from "./views/user/form/UserEditView";
import ObjectListView from "./views/object/list/ObjectListView";
import ObjectCreateView from "./views/object/form/ObjectCreateView";
import ObjectEditView from "./views/object/form/ObjectEditView";
import WarehouseListView from "./views/warehouse/list/WarehouseListView";
import WarehouseCreateView from "./views/warehouse/form/WarehouseCreateView";
import WarehouseEditView from "./views/warehouse/form/WarehouseEditView";

interface CustomRouteObject extends RouteObject {
    perm?: UserRolesEnum[],
    children?: CustomRouteObject[];
}

const routes: CustomRouteObject[] = [
    {
        path: '/',
        element: <IndexRedirectGuard/>,
    },
    {
        path: '/login',
        element: <LoginView/>
    },
    {
        element: <AuthGuard/>,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/home',
                        element: <HomePageView/>,
                    },
                    {
                        path: '/users',
                        element: <UsersListView/>,
                    },
                    {
                        path: '/users/create',
                        element: <UserCreateView/>,
                    },
                    {
                        path: '/users/:userId/edit',
                        element: <UserEditView/>,
                    },
                    {
                        path: '/objects',
                        element: <ObjectListView/>,
                    },
                    {
                        path: '/objects/create',
                        element: <ObjectCreateView/>,
                    },
                    {
                        path: '/objects/:objectId/edit',
                        element: <ObjectEditView/>,
                    },
                    {
                        path: '/warehouses',
                        element: <WarehouseListView/>,
                    },
                    {
                        path: '/warehouses/create',
                        element: <WarehouseCreateView/>,
                    },
                    {
                        path: '/warehouses/:warehouseId/edit',
                        element: <WarehouseEditView/>,
                    },
                ]
            }
        ]
    },
    {
        path: '*',
        element: <Error404View/>
    },
]

const filterRoutes = (routes: CustomRouteObject[]) => {
    return routes.filter((route) => {
        if (route.children) {
            route.children = filterRoutes(route.children)
            return true
        } else {
            if (route.perm) return hasPermission(route.perm)
            else return true
        }
    })
}

const Routes = () => {
    return useRoutes(filterRoutes(routes))
};

export default Routes;
