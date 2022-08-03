import React,{useState} from 'react';
import {styled} from "@mui/material/styles";
import {Box, CircularProgress, IconButton, Tooltip} from "@mui/material";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../utils/errorMessageHandler";
import {FiPrinter} from "react-icons/fi";
import ConfirmationModal from "./ConfirmationModal";
import appService from "../services/AppService";
import {useNavigate} from "react-router-dom";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

const PrintOverheadButton: React.FC<{overheadId: any}> = ({overheadId}) => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleAccept = async () => {
        try {
            setLoading(true)
            setOpen(true)

           let res: any = await appService.getPrintOverhead(overheadId) as { fileName: string }

            let response = await appService.getDownloadOverhead(res.fileName) as Blob

            const url = window.URL.createObjectURL(new Blob([response]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Накладной № ${overheadId}.xlsx`)
            document.body.appendChild(link);
            link.click()

            enqueueSnackbar(`Успешно получено`, {variant: 'success'})
            setOpen(false)
        }catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <Tooltip title={'Печать'}>
                    <IconButton
                        size="large"
                        onClick={() => setOpen(true)}
                        disabled={loading}
                        sx={{color: 'white'}}
                    >
                        <FiPrinter size={20} />
                    </IconButton>
                </Tooltip>
                {loading && <StyledCircularProgress size={44} color="secondary" thickness={2} />}
            </Box>
            <ConfirmationModal
                isOpen={open}
                title={"Вы уверены, что хотите создать Накладной?"}
                onClose={() => setOpen(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default PrintOverheadButton;
