import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {useSnackbar} from "notistack";
import {IMaterialResponse} from "../../../models/IMaterial";
import {ICategoryOption} from "../../../models";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import materialService from "../../../services/MaterialService";
import LoadingLayout from "../../../components/LoadingLayout";
import {useNavigate, useParams} from "react-router-dom";
import appService from "../../../services/AppService";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const MaterialEditView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const { materialId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [categories, setCategories] = useState<ICategoryOption[]>([])
    const [material, setMaterial] = useState<IMaterialResponse>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data: any = await materialService.getMaterial(materialId || '')
                const dataCategories: any = await appService.getOptionCategories()

                if (!cancel) {
                    if (dataCategories.length === 0) {
                        navigate(-1)
                        enqueueSnackbar('Добавьте с начала категории', {variant: 'info'})
                    } else {
                        setCategories(dataCategories)
                        setMaterial(data)
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
    }, [enqueueSnackbar, navigate, materialId])

    return (
        <>
            <Page title="Изменение материала"/>
            {!loading && !error && material && categories.length ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={material.name} />
                        <Box mt={3}>
                            <Form material={material} categories={categories} />
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default MaterialEditView;
