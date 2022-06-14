import React from 'react';
import {UserRolesEnum} from "./constants";
import {RouteObject, useRoutes} from "react-router-dom";
import HomePageView from "./views/HomePageView";
import Error404View from "./views/Error404View";
import LoginView from "./views/auth/LoginView";
import IndexRedirectGuard from "./components/IndexRedirectGuard";
import AuthGuard from "./components/AuthGuard";

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
        element: <AuthGuard/>,
        children: [
            {
                path: '/home',
                element: <HomePageView/>,
            },
        ]
    },
    {
        path: '/login',
        element: <LoginView/>
    },
    {
        path: '*',
        element: <Error404View/>
    },
]

const Routes = () => {
    return useRoutes(routes)
};

export default Routes;
