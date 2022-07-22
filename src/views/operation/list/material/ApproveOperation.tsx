import React, {useState} from 'react';
import {Box, Button, CircularProgress, Grid} from "@mui/material";
import {MdOutlineDone} from "react-icons/md";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {operationMaterialListActions, selectOperationMaterialList} from "../../../../store/reducers/operationSlice";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {IResTotalInfo} from "../../../../models/Operation";
import operationService from "../../../../services/operationService";

const ApproveOperation = () => {
    const {setTotalInfo} = operationMaterialListActions
    const {totalInfo} = useAppSelector(selectOperationMaterialList)
    const [loading, setLoading] = useState(false)
    const {enqueueSnackbar} = useSnackbar()
    const { operationId } = useParams()
    const dispatch = useAppDispatch()

    const handleApprove = async () => {
        try {
            setLoading(true)
            let data = await operationService.putApproveOperation(operationId!) as IResTotalInfo

            dispatch(setTotalInfo(data))
            enqueueSnackbar('Успешно подтвержден', {variant: 'success'});
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box p={2}>
            <Grid container spacing={3} justifyContent='right'>
                <Grid item>
                    <Button
                        variant='contained'
                        sx={{
                            backgroundColor: '#C5F2C7',
                            color: '#263238',
                            '&:hover': {
                                backgroundColor: '#b2e3b4',
                                color: '#263238',
                            },
                        }}
                        size='small'
                        disabled={loading || totalInfo!.approved}
                        endIcon={loading ? <CircularProgress size={16}/> : (totalInfo!.approved ? <MdOutlineDone/> : undefined)}
                        onClick={handleApprove}
                    >
                        Подтвердить
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ApproveOperation;