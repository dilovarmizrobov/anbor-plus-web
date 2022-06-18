import React from 'react';
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {Box, Button, Card, CardContent, Grid, TextField} from "@mui/material";
import {IObject} from "../../../models/IObject";
import objectService from "../../../services/objectService";

const Form: React.FC<{ object?: IObject }> = ({object}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const formik = useFormik<IObject>({
        initialValues: {
            name: object?.name || '',

        },
        validationSchema: Yup.object({
            name: Yup.string().max(255),
        }),
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            try {
                if (object) {
                    values.id = object.id!

                    await objectService.putUpdateObject(values)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await objectService.postNewObject(values)

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
                                        placeholder="Введите название обьекта"
                                        name="name"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        required
                                        value={formik.values.name}
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
                            {object ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default Form;
