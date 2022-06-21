import React, {useEffect, useState} from "react";
import authService from "../services/AuthService";
import {logout, selectAuth} from "../store/reducers/authSlice";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import api from "../utils/api";

const Auth: React.FC = () => {
    const dispatch = useAppDispatch()
    const {user} = useAppSelector(selectAuth)
    const [interceptor, setInterceptor] = useState(0)

    useEffect(() => {
        api.interceptors.request.eject(interceptor);
        let interceptorRequest = authService.setAxiosInterceptors(user!, () => dispatch(logout()))
        setInterceptor(interceptorRequest)
    }, [dispatch, user])

    return <></>
}

export default Auth
