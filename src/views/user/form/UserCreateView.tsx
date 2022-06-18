import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {IWarehouseOption} from "../../../models/IWarehouse";
import {useSnackbar} from "notistack";
import warehouseService from "../../../services/WarehouseService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UserCreateView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [warehouses, setWarehouses] = useState<IWarehouseOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const dataWarehouses: any = await warehouseService.getOptionWarehouses()

                if (!cancel) {
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
    }, [enqueueSnackbar])

    return (
        <>
            <Page title="Создание пользователя"/>
            {!loading && !error ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header/>
                        <Box mt={3}>
                            <Form warehouses={warehouses}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default UserCreateView;