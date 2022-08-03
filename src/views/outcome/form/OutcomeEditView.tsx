import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IOutcomeResponse} from "../../../models/IOutcome";
import outcomeService from "../../../services/outcomeService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingLayout from "../../../components/LoadingLayout";
import {Box, Container} from "@mui/material";
import Header from "./Header";
import Form from "./Form";
import {IDataOption} from "../../../models";
import {setOverheadMaterials} from "../../../store/reducers/overheadMaterialSlice";
import {useAppDispatch} from "../../../store/hooks";
import {OutcomeTypeEnum} from "../../../constants";

const Root = styled('div')(({theme}) => ({
    backgroundColor: theme.palette.background.default,
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const OutcomeEditView = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {outcomeId} = useParams()
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [outcome, setOutcome] = useState<IOutcomeResponse>()
    const [providers, setProviders] = useState<IDataOption[]>([])
    const [technics, setTechnics] = useState<IDataOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                setLoading(true)

                const data = await outcomeService.getOutcome(outcomeId || '') as IOutcomeResponse
                let dataType: IDataOption[] = []
                let dataTechnics: IDataOption[] = []

                if (data.typeFrom === OutcomeTypeEnum.TECHNIC) {
                    dataType = await outcomeService.getOptionCategoryTechnic() as IDataOption[]
                    dataTechnics = await outcomeService.getOptionTechnic(data.technicId!) as IDataOption[]
                } else {
                    dataType = await outcomeService.getOptionOutcomeType(data.typeFrom) as IDataOption[]
                }

                if (!cancel){
                    setOutcome(data)
                    dispatch(setOverheadMaterials(data.overheadItems))
                    setProviders(dataType)
                    setTechnics(dataTechnics)
                }
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: "error"})
            } finally {
                !cancel && setLoading(true)
            }
        })()
    },[enqueueSnackbar, outcomeId])

    return (
        <>
           <Page title="Изменение расхода" />
            {
                loading && !error && outcome ? (
                    <Root>
                        <Container maxWidth="xl">
                            <Header title={outcome.throwWhom} />
                            <Box mt={3}>
                                <Form outcome={outcome} prevProviders={providers} prevTechnics={technics} />
                            </Box>
                        </Container>
                    </Root>
                ) : <LoadingLayout loading={loading} error={error} />
            }
        </>
    );
};

export default OutcomeEditView;
