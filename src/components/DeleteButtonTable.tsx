import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import errorMessageHandler from "../utils/errorMessageHandler";
import ConfirmationModal from "./ConfirmationModal";
import {Box, CircularProgress, IconButton} from "@mui/material";
import {styled} from "@mui/material/styles";
import {FiTrash} from "react-icons/fi";

const StyledCircularProgress = styled(CircularProgress)(() => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-22px',
    marginLeft: '-22px',
}))

type DeleteButtonTableProps = {
    rowId: number;
    onDelete: Function;
    handleDelete: Function;
}

const DeleteButtonTable: React.FC<DeleteButtonTableProps> = ({rowId, onDelete, handleDelete}) => {
    const {enqueueSnackbar} = useSnackbar()
    const [loading, setLoading] = useState(false)
    const [openModal, setOpenModal] = useState(false)

    const handleAccept = async () => {
        try {
            setOpenModal(false)
            setLoading(true)

            await onDelete(rowId)

            enqueueSnackbar(`Успешно удалено`, {variant: 'success'})
            handleDelete(rowId)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Box sx={{position: 'relative', display: 'inline-block'}}>
                <IconButton
                    size="large"
                    onClick={() => setOpenModal(true)}
                    disabled={loading}
                >
                    <FiTrash size={20} />
                </IconButton>
                {loading && <StyledCircularProgress size={44} color='secondary' thickness={2}/>}
            </Box>
            <ConfirmationModal
                isOpen={openModal}
                title={'Вы уверены, что хотите удалить?'}
                description={'При удалие записи, его нельзя будет восстановить. Пожалуйста, убедитесь, что вы хотите удалить именно этот запись.'}
                onClose={() => setOpenModal(false)}
                onAccept={handleAccept}
            />
        </>
    );
};

export default DeleteButtonTable;