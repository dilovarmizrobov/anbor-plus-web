import React, {useEffect} from "react";
import authService from "../services/AuthService";
import {logout} from "../store/reducers/authSlice";
import {useAppDispatch} from "../store/hooks";

const Auth: React.FC = () => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        authService.setAxiosInterceptors(() => dispatch(logout()))
    }, [dispatch])

    return <></>
}

export default Auth
