import React from 'react';
import {IGarageInfo} from "../../../models/ITechnique";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";

interface ModalProps {
    info: IGarageInfo;
    onClose: VoidFunction;
    onAccept: (values: IGarageInfo) => void;
}

const EditTechniqueModal: React.FC<ModalProps> = ({info, onClose, onAccept}) => {
    const garageInfo = useFormik<IGarageInfo>({
        initialValues: {
            number: info?.number || '',
            incomeDate: info?.incomeDate || '',
            releaseYear: info?.releaseYear || ''
        },
        validationSchema: Yup.object({
            number: Yup.string().max(255).required(),
            incomeDate: Yup.string().max(255).required(),
            releaseYear: Yup.string().max(255).required(),
        }),
        onSubmit: (values) => {
            onAccept(values)
            onClose()
        }
    })

    return (
        <Dialog
            onClose={onClose}
            open={true}
        >
            <DialogTitle>Изменеие инфо</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                    <Grid item xs={12}>
                        <TextField
                            error={garageInfo.touched.number && Boolean(garageInfo.errors.number)}
                            fullWidth
                            helperText={garageInfo.touched.number && garageInfo.errors.number}
                            label="Гаражный номер"
                            placeholder="Введите номер"
                            name="number"
                            onBlur={garageInfo.handleBlur}
                            onChange={garageInfo.handleChange}
                            required
                            value={garageInfo.values.number}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={garageInfo.touched.incomeDate && Boolean(garageInfo.errors.incomeDate)}
                            fullWidth
                            helperText={garageInfo.touched.incomeDate && garageInfo.errors.incomeDate}
                            label="Дата прихода"
                            placeholder="Введите дату прихода"
                            name="incomeDate"
                            type="date"
                            onBlur={garageInfo.handleBlur}
                            onChange={garageInfo.handleChange}
                            required
                            value={garageInfo.values.incomeDate}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            error={garageInfo.touched.releaseYear && Boolean(garageInfo.errors.releaseYear)}
                            fullWidth
                            helperText={garageInfo.touched.releaseYear && garageInfo.errors.releaseYear}
                            label="Год выпуска"
                            placeholder="Выберите год"
                            name="releaseYear"
                            onBlur={garageInfo.handleBlur}
                            onChange={garageInfo.handleChange}
                            required
                            value={garageInfo.values.releaseYear}
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
                <Button onClick={garageInfo.submitForm}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog >

    );
};

export default EditTechniqueModal;
