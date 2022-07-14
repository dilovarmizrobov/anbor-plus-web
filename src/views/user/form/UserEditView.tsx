import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IUserResponse} from "../../../models/IUser";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import userService from "../../../services/userService";
import LoadingLayout from "../../../components/LoadingLayout";
import Form from "./Form";
import {IWarehouseOption} from "../../../models/IWarehouse";
import appService from "../../../services/AppService";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UserEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const { userId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [user, setUser] = useState<IUserResponse>()
    const [warehouses, setWarehouses] = useState<IWarehouseOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await userService.getUser(userId || '')
                const dataWarehouses: any = await appService.getOptionWarehouses()

                if (!cancel) {
                    setUser(data)
                    setWarehouses(dataWarehouses)
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, userId])

    return (
        <>
            <Page title="Изменение пользователя"/>
            {!loading && !error && user ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={user.fullName}/>
                        <Box mt={3}>
                            <Form user={user} warehouses={warehouses}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default UserEditView;