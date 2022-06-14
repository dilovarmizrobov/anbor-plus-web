import React from "react";
import {useAppSelector} from "../store/hooks";
import {selectAuth} from "../store/reducers/authSlice";
import {Navigate, Outlet, useLocation} from "react-router-dom";

const AuthGuard: React.FC = () => {
    const auth = useAppSelector(selectAuth)
    let location = useLocation();

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />
}

export default AuthGuard
