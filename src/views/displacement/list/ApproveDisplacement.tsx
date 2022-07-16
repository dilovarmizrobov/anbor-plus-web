import React, {useEffect, useState} from 'react';
import {Badge, Box, Button, CircularProgress, Grid, IconButton} from "@mui/material";
import displacementService from "../../../services/DisplacementService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {MdClose, MdOutlineDone} from "react-icons/md";
import {TbCameraPlus} from "react-icons/tb";
import {styled} from "@mui/material/styles";
import {IResDisplacementStatus} from "../../../models/Displacement";
import {useParams} from "react-router-dom";
import {PATH_OVERHEADS_IMAGE} from "../../../constants";
import PreviewImageModal from "../../../components/PreviewImageModal";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {selectPreviewImage, setPreviewImageUrl} from "../../../store/reducers/previewImageSlice";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {selectAuth} from "../../../store/reducers/authSlice";

const StyledImage = styled('div')(() => ({
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
}))

const StyledIconButton = styled(IconButton)(() => ({
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    padding: 1,
    '&:hover': {
        backgroundColor: 'white',
    }
}))

const ApproveDisplacement: React.FC<{warehouseDestinationId: number}> = ({warehouseDestinationId}) => {
    const NumberOfImage = 6
    const dispatch = useAppDispatch()
    const {previewImageUrl} = useAppSelector(selectPreviewImage)
    const {user} = useAppSelector(selectAuth)
    const {enqueueSnackbar} = useSnackbar()
    const { displacementId } = useParams()
    const [uploadLoading, setUploadLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)
    const [displacementStatus, setDisplacementStatus] = useState<IResDisplacementStatus>()
    const whoCouldApprove = hasPermission(PERMISSIONS.APPROVE_DISPLACEMENT)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                let data = await displacementService.getDisplacementStatus(displacementId || '') as IResDisplacementStatus
                if (!cancel) setDisplacementStatus(data)
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [displacementId, enqueueSnackbar])

    const handleApprove = async () => {
        try {
            setApproveLoading(true)
            let data = await displacementService.putApproveDisplacement(displacementStatus!.id) as IResDisplacementStatus

            setDisplacementStatus(data)
            enqueueSnackbar('Успешно подтвержден', {variant: 'success'});
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setApproveLoading(false)
        }
    }

    const handleDeleteImage = async (imageName: string) => {
        try {
            setUploadLoading(true)

            let data = await displacementService.deleteImageDisplacement(displacementStatus!.id, imageName) as IResDisplacementStatus

            setDisplacementStatus(data)
            enqueueSnackbar(`Успешно удалено`, {variant: 'success'})
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setUploadLoading(false)
        }
    }

    return displacementStatus ? (
        <Box p={2}>
            <Grid container spacing={3} alignItems='center' justifyContent='right'>
                {displacementStatus.imageNames.map((image, index) => (
                    <Grid item xs="auto" key={index}>
                        <Badge
                            badgeContent={displacementStatus.approved ? undefined : (
                                <StyledIconButton size="small" onClick={() => handleDeleteImage(image)} disabled={uploadLoading}>
                                    <MdClose size={14}/>
                                </StyledIconButton>
                            )}
                        >
                            <StyledImage sx={{backgroundImage: `url(${PATH_OVERHEADS_IMAGE + image})`}} onClick={() => dispatch(setPreviewImageUrl(PATH_OVERHEADS_IMAGE + image))}/>
                        </Badge>
                    </Grid>
                ))}
                {whoCouldApprove && (displacementStatus.imageNames.length < NumberOfImage) && (
                    <Grid item xs="auto">
                        <label>
                            <input
                                multiple
                                accept="image/*"
                                type="file"
                                style={{display: "none"}}
                                disabled={uploadLoading}
                                onChange={async (e) => {
                                    let files = (e.target as HTMLInputElement).files!;
                                    let imageFiles = []

                                    for (let i = 0; i < files.length; i++) {
                                        imageFiles.push(files[i])
                                        if ((NumberOfImage - displacementStatus.imageNames.length) === i + 1) break;
                                    }

                                    try {
                                        setUploadLoading(true)

                                        let data = await displacementService.putUploadImageDisplacement(displacementStatus.id, imageFiles) as IResDisplacementStatus

                                        setDisplacementStatus(data)
                                        enqueueSnackbar(`Успешно загружено`, {variant: 'success'})
                                    } catch (error: any) {
                                        enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                                    } finally {
                                        setUploadLoading(false)
                                    }

                                    (e.target as HTMLInputElement).value = ''
                                }}
                            />
                            <IconButton size="large" component="span" disabled={uploadLoading}>
                                <TbCameraPlus size={30}/>
                            </IconButton>
                        </label>
                    </Grid>
                )}
                {!displacementStatus.approved && whoCouldApprove && (user!.warehouse.id === warehouseDestinationId) && (
                    <Grid item xs="auto">
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
                            disabled={approveLoading || displacementStatus.approved}
                            endIcon={approveLoading ? <CircularProgress size={16}/> : (displacementStatus.approved ? <MdOutlineDone/> : undefined)}
                            onClick={handleApprove}
                        >
                            Подтвердить
                        </Button>
                    </Grid>
                )}
            </Grid>
            {previewImageUrl && <PreviewImageModal/>}
        </Box>
    ) : null
};

export default ApproveDisplacement;