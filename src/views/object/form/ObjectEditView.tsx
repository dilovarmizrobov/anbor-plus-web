import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IObject} from "../../../models/IObject";
import objectService from "../../../services/objectService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import LoadingLayout from "../../../components/LoadingLayout";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const ObjectEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const {objectId} = useParams()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [object, setObject] = useState<IObject>()

    useEffect(() => {
        let cancel = false;

        (async () => {
                try {
                    setLoading(true)

                    const data: any = await objectService.getObject(objectId || '')

                    if (!cancel) setObject(data)
                } catch (error: any) {
                    !cancel && setError(true)
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                } finally {
                    !cancel && setLoading(false)
                }
            }
        )()
        return () => {cancel = true}
    }, [enqueueSnackbar, objectId])

    return (
        <>
            <Page title="Изминение название" />
            {
                object ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={object?.name} />
                            <Box mt={3}>
                                <Form object={object} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default ObjectEditView;
