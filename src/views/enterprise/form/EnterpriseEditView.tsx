import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import { IEnterpriseResponse} from "../../../models/IEnterprise";
import Page from "../../../components/Page";
import enterpriseService from "../../../services/enterpriseService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import LoadingLayout from "../../../components/LoadingLayout";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))


const EnterpriseEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const {enterpriseId} = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [enterprise, setEnterprise] = useState<IEnterpriseResponse>()

    useEffect(() => {
        let cancel = false;

        (
            async () => {
                try {
                    setLoading(true)

                    const data : any = await enterpriseService.getEnterprise(enterpriseId || '')

                    if (!cancel) setEnterprise(data)

                }catch (error: any) {
                    !cancel && setError(true)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                }finally {
                    !cancel && setLoading(false)
                }
            }
        )()
        return () => {cancel = true}
    }, [enqueueSnackbar, enterpriseId])

    return (
        <>
            <Page title="Изменение предприятия" />
            {
                enterprise ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={enterprise.name} />
                            <Box mt={3}>
                                <Form enterprise={enterprise} />
                            </Box>
                        </Container>
                    </Root>
                ):<LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default EnterpriseEditView;
