import React from 'react';
import {IUserRequest, IUserResponse} from "../../../models/IUser";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import {useFormik} from "formik";
import {UserRolesEnum, UserRolesMap} from "../../../constants";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import userService from "../../../services/userService";
import {Box, Button, Card, CardContent, Grid, MenuItem, TextField} from "@mui/material";
import {IWarehouseOption} from "../../../models/IWarehouse";

const Form: React.FC<{user?: IUserResponse, warehouses: IWarehouseOption[]}> = ({user, warehouses}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();

    const formik = useFormik<IUserRequest>({
        initialValues: {
            fullName: user?.fullName || '',
            role: user?.role || UserRolesEnum.WAREHOUSEMAN,
            warehouseId: user?.warehouse?.id || 0,
            phoneNumber: user?.phoneNumber || '',
            password: '',
        },
        validationSchema: Yup.object({
            fullName: Yup.string().max(255),
            phoneNumber: Yup.string().max(255),
            password: Yup.string().max(255),
        }),
        onSubmit: async (values, {setStatus, setSubmitting}) => {
            let warehouseId = values.warehouseId

            if (values.role !== UserRolesEnum.WAREHOUSEMAN) {
                delete values.warehouseId
            }

            try {
                if (user) {
                    values.id = user.id!

                    await userService.putUpdateUser(values)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await userService.postNewUser(values)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                    navigate(-1)
                }
            } catch (error: any) {
                setStatus({success: false});
                setSubmitting(false);
                values.warehouseId = warehouseId

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
                                        error={formik.touched.fullName && Boolean(formik.errors.fullName)}
                                        fullWidth
                                        autoFocus
                                        helperText={formik.touched.fullName && formik.errors.fullName}
                                        label="ФИО"
                                        placeholder="Введите ФИО"
                                        name="fullName"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        required
                                        value={formik.values.fullName}
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        error={Boolean(formik.touched.role && formik.errors.role)}
                                        fullWidth
                                        helperText={formik.touched.role && formik.errors.role}
                                        label="Должность"
                                        name="role"
                                        onBlur={formik.handleBlur}
                                        onChange={(e) => {
                                            formik.handleChange(e)
                                        }}
                                        required
                                        value={formik.values.role}
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                        SelectProps={{
                                            MenuProps: {
                                                variant: "selectedMenu",
                                                anchorOrigin: {
                                                    vertical: "bottom",
                                                    horizontal: "left"
                                                },
                                                transformOrigin: {
                                                    vertical: "top",
                                                    horizontal: "left"
                                                },
                                            }
                                        }}
                                    >
                                        {Object.keys(UserRolesEnum).map(item => (
                                                <MenuItem key={item} value={item}>
                                                    {UserRolesMap.get(item as UserRolesEnum)}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                {formik.values.role === UserRolesEnum.WAREHOUSEMAN && (
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            error={Boolean(formik.touched.warehouseId && formik.errors.warehouseId)}
                                            fullWidth
                                            helperText={formik.touched.warehouseId && formik.errors.warehouseId}
                                            label="Склад"
                                            name="warehouseId"
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            required
                                            value={formik.values.warehouseId || ''}
                                            variant="outlined"
                                            InputLabelProps={{shrink: true}}
                                            SelectProps={{
                                                MenuProps: {
                                                    variant: "selectedMenu",
                                                    anchorOrigin: {
                                                        vertical: "bottom",
                                                        horizontal: "left"
                                                    },
                                                    transformOrigin: {
                                                        vertical: "top",
                                                        horizontal: "left"
                                                    },
                                                }
                                            }}
                                        >
                                            {warehouses.map(item => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.name}
                                                </MenuItem>
                                            ))
                                            }
                                        </TextField>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(formik.touched.phoneNumber && formik.errors.phoneNumber)}
                                        fullWidth
                                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                                        label="Логин (телефон)"
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
                                <Grid item xs={12}>
                                    <TextField
                                        error={Boolean(formik.touched.password && formik.errors.password)}
                                        fullWidth
                                        helperText={formik.touched.password && formik.errors.password}
                                        label="Пароль"
                                        placeholder="Введите пароль"
                                        name="password"
                                        onBlur={formik.handleBlur}
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                        variant="outlined"
                                        InputLabelProps={{shrink: true}}
                                        type="password"
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
                            {user ? 'Сохранить' : 'Создать'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default Form;