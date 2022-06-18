import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import Form from "./Form";
import {IWarehouseResponse} from "../../../models/IWarehouse";
import warehouseService from "../../../services/WarehouseService";

const Root = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const WarehouseEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const { warehouseId } = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [warehouse, setWarehouse] = useState<IWarehouseResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data: any = await warehouseService.getWarehouse(warehouseId || '')

                if (!cancel) setWarehouse(data)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, warehouseId])

    return (
        <>
            <Page title="Изменение склада"/>
            {warehouse ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={warehouse.name}/>
                        <Box mt={3}>
                            <Form warehouse={warehouse}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default WarehouseEditView;