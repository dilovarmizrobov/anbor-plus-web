import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useParams} from "react-router-dom";
import Page from "../../../components/Page";
import {IWarehouseOption} from "../../../models/IWarehouse";
import appService from "../../../services/AppService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingLayout from "../../../components/LoadingLayout";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {IResDisplacement} from "../../../models/Displacement";
import displacementService from "../../../services/DisplacementService";
import {setOverheadMaterials} from "../../../store/reducers/overheadMaterialSlice";
import {useAppDispatch} from "../../../store/hooks";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DisplacementFormView = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { displacementId } = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [warehouses, setWarehouses] = useState<IWarehouseOption[]>([])
    const [displacement, setDisplacement] = useState<IResDisplacement>()

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)
                let data: IResDisplacement | undefined;

                if (displacementId) {
                   data = await displacementService.getDisplacement(displacementId || '') as IResDisplacement
                }

                const dataWarehouses: any = await appService.getOptionWarehouses()

                if (!cancel) {
                    if (displacementId) {
                        setDisplacement(data)
                        dispatch(setOverheadMaterials(data!.overheadItems))
                    }

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
    }, [])

    return (
        <>
            <Page title={(displacementId ? `Изменение` : `Создание`) + ` перемещения`}/>
            {!loading && !error && (displacementId ? warehouses : true) ? (
                <Root>
                    <Container maxWidth="xl">
                        <Header title={displacement?.autoDetail}/>
                        <Box mt={3}>
                            <Form displacement={displacement} warehouses={warehouses}/>
                        </Box>
                    </Container>
                </Root>
            ) : <LoadingLayout loading={loading} error={error} />}
        </>
    );
};

export default DisplacementFormView;