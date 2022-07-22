import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useAppDispatch} from "../../../store/hooks";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IResOperation} from "../../../models/Operation";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import LoadingLayout from "../../../components/LoadingLayout";
import {setOverheadMaterials} from "../../../store/reducers/overheadMaterialSlice";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import Header from "./Header";
import operationService from "../../../services/operationService";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const OperationFormView = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { operationId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [operation, setOperation] = useState<IResOperation>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                let data: IResOperation | undefined;

                if (operationId) {
                    data = await operationService.getOperation(operationId || '') as IResOperation

                    if (!cancel) {
                        setOperation(data)
                        dispatch(setOverheadMaterials(data!.overheadItems))
                    }
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [])

    return (
        <>
            <Page title={(operationId ? `Изменение` : `Создание`) + ` операции`}/>
            {!loading && !error && (operationId ? operation : true) ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header id={operation?.id}/>
                        <Box mt={3}>
                            <Form operation={operation}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default OperationFormView;