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
import EnterpriseListView from "./views/enterprise/list/EnterpriseListView";
import EnterpriseCreateView from "./views/enterprise/form/EnterpriseCreateView";
import EnterpriseEditView from "./views/enterprise/form/EnterpriseEditView";
import ProviderListView from "./views/provider/list/ProviderListView";
import ProviderCreateView from "./views/provider/form/ProviderCreateView";
import ProviderEditView from "./views/provider/form/ProviderEditView";
import MaterialListView from "./views/material/list/MaterialListView";
import MaterialCreateView from "./views/material/form/MaterialCreateView";
import MaterialEditView from "./views/material/form/MaterialEditView";
import IncomeCreateView from "./views/income/form/IncomeCreateView";
import IncomeListView from "./views/income/list/IncomeListView";
import IncomeEditView from "./views/income/form/IncomeEditView";
import IncomeMaterialListView from "./views/income/list/material/IncomeMaterialListView";
import WarehouseBalanceListView from "./views/warehouse-balance/WarehouseBalanceListView";
import OutcomeCreateView from "./views/outcome/form/OutcomeCreateView";
import OutcomeListView from "./views/outcome/list/OutcomeListView";
import OutcomeEditView from "./views/outcome/form/OutcomeEditView";
import DetailTableListView from "./views/outcome/list/material/DetailTableListView";

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
                        path: '/incomes',
                        element: <IncomeListView/>,
                    },
                    {
                        path: '/incomes/create',
                        element: <IncomeCreateView/>,
                    },
                    {
                        path: '/incomes/:incomeId/edit',
                        element: <IncomeEditView/>,
                    },
                    {
                        path: '/incomes/:incomeId/materials',
                        element: <IncomeMaterialListView/>,
                    },
                    {
                        path: '/warehouse-balance',
                        element: <WarehouseBalanceListView/>,
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
                        path: '/materials',
                        element: <MaterialListView/>,
                    },
                    {
                        path: '/materials/create',
                        element: <MaterialCreateView/>,
                    },
                    {
                        path: '/materials/:materialId/edit',
                        element: <MaterialEditView/>,
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
                        path: '/outcomes',
                        element: <OutcomeListView/>,
                    },
                    {
                        path: '/outcomes/create',
                        element: <OutcomeCreateView/>,
                    },
                    {
                        path: '/outcomes/:outcomeId/edit',
                        element: <OutcomeEditView/>,
                    },
                    {
                        path: '/outcomes/:outcomeId/materials',
                        element: <DetailTableListView/>,
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
                    {
                        path: '/enterprises',
                        element: <EnterpriseListView/>,
                    },
                    {
                        path: '/enterprises/create',
                        element: <EnterpriseCreateView/>,
                    },
                    {
                        path: '/enterprises/:enterpriseId/edit',
                        element: <EnterpriseEditView/>,
                    },
                    {
                        path: '/providers',
                        element: <ProviderListView/>,
                    },
                    {
                        path: '/providers/create',
                        element: <ProviderCreateView/>,
                    },
                    {
                        path: '/providers/:providerId/edit',
                        element: <ProviderEditView/>,
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
