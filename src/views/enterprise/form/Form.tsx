import React from 'react';
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Box, Button, Card, CardContent, Grid, TextField} from "@mui/material";
import {IEnterpriseRequest, IEnterpriseResponse} from "../../../models/IEnterprise";
import enterpriseService from "../../../services/enterpriseService";

const Form: React.FC<{ enterprise?: IEnterpriseResponse }> = ({enterprise}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const formik = useFormik<IEnterpriseRequest>({
        initialValues: {
            name: enterprise?.name || '',
            phoneNumber: enterprise?.phoneNumber || '',

        },
        validationSchema: Yup.object({
            name: Yup.string().max(255),
            phoneNumber: Yup.string().max(255),
        }),
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            try {
                if (enterprise) {
                    values.id = enterprise.id!

                    await enterpriseService.putUpdateEnterprise(values)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await enterpriseService.postNewEnterprise(values)

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
                                        placeholder="Введите название"
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
                                        error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                                        fullWidth
                                        autoFocus
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                        label="Телефон"
                                        placeholder="Введите номер телефона"
                                        name="phoneNumber"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        required
                                        value={formik.values.phoneNumber}
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
                            {enterprise ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default Form;
