import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {useSnackbar} from "notistack";
import {IDataOption} from "../../../models";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import {useNavigate, useParams} from "react-router-dom";
import appService from "../../../services/AppService";
import {ITechniqueResponse} from "../../../models/ITechnique";
import techniqueService from "../../../services/TechniqueService";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const TechniqueEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { techniqueId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [categories, setCategories] = useState<IDataOption[]>([])
    const [technique, setTechnique] = useState<ITechniqueResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await techniqueService.getTechnique(techniqueId || '')
                const dataCategories: any = await appService.getTechnicCategoriesOption()

                if (!cancel) {
                    if (dataCategories.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала категории', {variant: 'info'})
                    } else {
                        setCategories(dataCategories)
                        setTechnique(data)
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
    }, [enqueueSnackbar, navigate, techniqueId])

    return (
        <>
            <Page title="Изменение техника"/>
            {!loading && !error && technique && categories.length ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={technique.name} />
                        <Box mt={3}>
                            <Form technique={technique} categories={categories} />
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default TechniqueEditView;
