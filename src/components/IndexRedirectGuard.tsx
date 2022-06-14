import React from "react";
import {useAppSelector} from "../store/hooks";
import {selectAuth} from "../store/reducers/authSlice";
import {Navigate, useLocation} from "react-router-dom";

const IndexRedirectGuard: React.FC = () => {
    const {isAuthenticated} = useAppSelector(selectAuth)
    let location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Navigate to="/home" state={{ from: location }} replace />;
}

export default IndexRedirectGuard
