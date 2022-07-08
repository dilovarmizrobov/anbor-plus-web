import React from 'react';
import {
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid, TextField,
} from "@mui/material";
import * as Yup from "yup";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useSnackbar} from "notistack";
import {useFormik} from "formik";
import {IOutcomeMaterialListResponse, PriceEditRequest} from "../../../../models/IOutcome";
import {
    closeEditPriceModal,
    editMaterial,
    selectOutcomeMaterialList
} from "../../../../store/reducers/outcomeMaterialListSlice";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import outcomeService from "../../../../services/outcomeService";


const EditPriceModal = () => {
    const dispatch = useAppDispatch()
    const {materialEditPriceId, materialEditPrice} = useAppSelector(selectOutcomeMaterialList)
    const {enqueueSnackbar} = useSnackbar()

    const formik = useFormik<PriceEditRequest>({
        initialValues: {
            itemId: materialEditPriceId,
            price: materialEditPrice,
            comment: ''
        },
        validationSchema: Yup.object({
            price: Yup.number().required(),
            comment: Yup.string().max(255),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            try {
                let outcomeMaterial = await outcomeService.putMaterialPriceEdit(values) as IOutcomeMaterialListResponse
                dispatch(editMaterial(outcomeMaterial))
                enqueueSnackbar('Успешно обновлен', {variant: 'success'})
            } catch (error: any) {
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    return (
        <Dialog
            open={true}
            fullWidth
        >
            <DialogTitle>Изменения цены материала</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={7} md={5}>
                        <TextField
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            fullWidth
                            autoFocus
                            helperText={formik.touched.price && formik.errors.price}
                            label="Цена"
                            placeholder="Введите цену"
                            name="price"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            required
                            value={formik.values.price}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <TextField
                            fullWidth
                            error={Boolean(formik.touched.comment && formik.errors.comment)}
                            helperText={formik.touched.comment && formik.errors.comment}
                            label="Комментарий"
                            name="comment"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.comment}
                            variant="outlined"
                            multiline
                            rows={2}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{pr: 3, pb: 3}}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => dispatch(closeEditPriceModal())}
                    disabled={formik.isSubmitting}
                >
                    Отмена
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={formik.submitForm}
                    disabled={formik.isSubmitting}
                    endIcon={formik.isSubmitting ? <CircularProgress size={16} /> : undefined}
                >
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(EditPriceModal);
