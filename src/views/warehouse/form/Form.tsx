import React from 'react';
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Box, Button, Card, CardContent, Grid, TextField} from "@mui/material";
import {IWarehouseRequest, IWarehouseResponse} from "../../../models/IWarehouse";
import warehouseService from "../../../services/WarehouseService";

const Form: React.FC<{warehouse?: IWarehouseResponse}> = ({warehouse}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const formik = useFormik<IWarehouseRequest>({
        initialValues: {
            name: warehouse?.name || '',
            enterpriseName: warehouse?.enterpriseName || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255),
            enterpriseName: Yup.string().max(255),
        }),
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            try {
                if (warehouse) {
                    values.id = warehouse.id!

                    await warehouseService.putUpdateWarehouse(values)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await warehouseService.postNewWarehouse(values)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                    navigate(-1)
                }
            } catch (error: any) {
                setStatus({success: false});
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card>
                <CardContent sx={{p: 3}}>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        fullWidth
                                        autoFocus
                                        helperText={formik.touched.name && formik.errors.name}
                                        label="Название"
                                        placeholder="Введите название склада"
                                        name="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        required
                                        value={formik.values.name}
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(formik.touched.enterpriseName && formik.errors.enterpriseName)}
                                        fullWidth
                                        helperText={formik.touched.enterpriseName && formik.errors.enterpriseName}
                                        label="Предприятие"
                                        placeholder="Введите название предприятия"
                                        name="enterpriseName"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        required
                                        value={formik.values.enterpriseName}
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Box sx={{mb: 3, mt: 4, float: 'right'}}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            type="button"
                            disabled={formik.isSubmitting}
                            onClick={() => navigate(-1)}
                            sx={{marginRight: 2, width: 170}}
                        >
                            Отмена
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            type="submit"
                            disabled={formik.isSubmitting}
                            sx={{width: 170}}
                        >
                            {warehouse ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default Form;