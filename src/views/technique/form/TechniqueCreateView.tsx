import React, {useEffect, useState} from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import {IDataOption} from "../../../models";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import appService from "../../../services/AppService";
import Form from "./Form";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const TechniqueCreateView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [categories, setCategories] = useState<IDataOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const dataCategories: any = await appService.getTechnicCategoriesOption()

                if (!cancel) {
                    if (dataCategories.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала категории', {variant: 'info'})
                    } else setCategories(dataCategories)
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, navigate])

    return (
        <>
            <Page title="Создание Техники"/>
            {
                !loading && !error && categories.length ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header/>
                            <Box mt={3}>

                                <Form categories={categories}/>

                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error}/>
            }
        </>
    );
};

export default TechniqueCreateView;
