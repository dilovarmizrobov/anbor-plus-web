import React from 'react';
import {IMaterialMark} from "../../../models/IMaterial";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";

interface ModalProps {
    mark?: IMaterialMark;
    onClose: VoidFunction;
    onAccept: (values: IMaterialMark) => void;
}

const EditMarkModal: React.FC<ModalProps> = ({onClose, onAccept, mark}) => {
    const markForm = useFormik<IMaterialMark>({
        initialValues: {
            name: mark?.name || '',
            sku: mark?.sku || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required(),
            sku: Yup.string().max(255).required(),
        }),
        onSubmit: (values) => {
            onAccept(values)
            onClose()
        }
    })

    return (
        <Dialog
            open={true}
            onClose={onClose}
        >
            <DialogTitle>Изменение марки</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            error={markForm.touched.name && Boolean(markForm.errors.name)}
                            fullWidth
                            helperText={markForm.touched.name && markForm.errors.name}
                            label="Марка"
                            placeholder="Введите марку"
                            name="name"
                            onBlur={markForm.handleBlur}
                            onChange={markForm.handleChange}
                            required
                            value={markForm.values.name}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={markForm.touched.sku && Boolean(markForm.errors.sku)}
                            fullWidth
                            helperText={markForm.touched.sku && markForm.errors.sku}
                            label="Аритикуль"
                            placeholder="Введите код товара"
                            name="sku"
                            onBlur={markForm.handleBlur}
                            onChange={markForm.handleChange}
                            required
                            value={markForm.values.sku}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Отмена
                </Button>
                <Button onClick={markForm.submitForm}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditMarkModal;