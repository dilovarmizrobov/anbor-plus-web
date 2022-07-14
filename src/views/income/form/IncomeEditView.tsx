import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {Box, Container} from "@mui/material";
import Form from "./Form";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IIncomeResponse} from "../../../models/IIncome";
import LoadingLayout from "../../../components/LoadingLayout";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import incomeService from "../../../services/IncomeService";
import {setOverheadMaterials} from "../../../store/reducers/overheadMaterialSlice";
import {useAppDispatch} from "../../../store/hooks";
import {IDataOption} from "../../../models";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const IncomeEditView = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { incomeId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [income, setIncome] = useState<IIncomeResponse>()
    const [providers, setProviders] = useState<IDataOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data = await incomeService.getIncome(incomeId || '') as IIncomeResponse
                const providersData = await incomeService.getOptionProviders(data.typeFrom) as IDataOption[]

                if (!cancel) {
                    setIncome(data)
                    dispatch(setOverheadMaterials(data.overheadItems))
                    setProviders(providersData)
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, incomeId])

    return (
        <>
            <Page title="Изменение прихода"/>
            {!loading && !error && income ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={income.throwWhom} />
                        <Box mt={3}>
                            <Form income={income} prevProviders={providers}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default IncomeEditView;