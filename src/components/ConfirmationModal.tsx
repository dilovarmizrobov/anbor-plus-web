import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    onClose: VoidFunction;
    onAccept: VoidFunction;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = (props) => {
    const {isOpen, title, description, onAccept, onClose} = props

    return (
        <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle style={{marginTop: 16}} id="alert-dialog-title">
                {title}
            </DialogTitle>
            {
                description && (
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">{description}</DialogContentText>
                    </DialogContent>
                )
            }
            <DialogActions>
                <Button onClick={onClose}>
                    Отмена
                </Button>
                <Button onClick={onAccept}>
                    Ок
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationModal;