import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IProviderResponse} from "../../../models/IProvider";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import providerService from "../../../services/providerService";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import LoadingLayout from "../../../components/LoadingLayout";
import {styled} from "@mui/material/styles";
import Header from "./Header";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const ProviderEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const {providerId} = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [provider, setProvider] = useState<IProviderResponse>()

    useEffect(() => {
        let cancel = false;

        (
            async () => {
                try {
                    setLoading(true)

                    const data : any = await providerService.getProvider(providerId || '')

                    if (!cancel) setProvider(data)

                }catch (error: any) {
                    !cancel && setError(true)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                }finally {
                    !cancel && setLoading(false)
                }
            }
        )()
        return () => {cancel = true}
    }, [enqueueSnackbar, providerId])

    return (
        <>
            <Page title="Изменение снабженца" />
            {
                provider ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={provider.name} />
                            <Box mt={3}>
                                <Form provider={provider} />
                            </Box>
                        </Container>
                    </Root>
                ):<LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default ProviderEditView;
