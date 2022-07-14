import React, {useEffect, useState} from 'react';
import {IReqDisplacement, IResDisplacement} from "../../../models/Displacement";
import {IWarehouseOption} from "../../../models/IWarehouse";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {reset, selectOverheadMaterial} from "../../../store/reducers/overheadMaterialSlice";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import OverheadImage, {IOverheadImage, mapToImages} from "../../../components/OverheadImage";
import {useFormik} from "formik";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import displacementService from "../../../services/DisplacementService";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    MenuItem,
    TextField
} from "@mui/material";
import OverheadMaterialList from "../../../components/overhead-material/form";

const Form: React.FC<{displacement?: IResDisplacement, warehouses: IWarehouseOption[]}> = ({displacement, warehouses}) => {
    const {materials} = useAppSelector(selectOverheadMaterial)
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [images, setImages] = useState<IOverheadImage[]>(displacement ? mapToImages(displacement.imageNames) : [])
    const [imageFiles, setImageFiles] = useState<File[]>([])

    useEffect(() => () => {dispatch(reset())}, [])

    const formik = useFormik<IReqDisplacement>({
        initialValues: {
            autoDetail: displacement?.autoDetail || '',
            throwWhom: displacement?.throwWhom || '',
            warehouseDestinationId: displacement?.warehouseDestinationId || 0,
            comment: displacement?.comment || '',
            images: [],
            overheadItems: []
        },
        validationSchema: Yup.object({
            autoDetail: Yup.string().max(255).required('Введите значение'),
            throwWhom: Yup.string().max(255).required('Введите значение'),
            warehouseDestinationId: Yup.number().not([0], 'Выберите значение').required(),
        }),
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.overheadItems = materials

            try {
                if (displacement) {
                    values.id = displacement.id
                    let imageNames = images.filter(item => item.name).map(item => item.name!)

                    await displacementService.putUpdateDisplacement(values, imageFiles, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                } else {
                    await displacementService.postNewDisplacement(values, imageFiles)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                }

                navigate(-1)
            } catch (error: any) {
                setStatus({success: false});
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    return (
        <Card>
            <CardContent sx={{p: 3}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={formik.touched.autoDetail && Boolean(formik.errors.autoDetail)}
                                    fullWidth
                                    helperText={formik.touched.autoDetail && formik.errors.autoDetail}
                                    label="А/М"
                                    placeholder="Введите автомашину и водителя"
                                    name="autoDetail"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.autoDetail}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={formik.touched.throwWhom && Boolean(formik.errors.throwWhom)}
                                    fullWidth
                                    helperText={formik.touched.throwWhom && formik.errors.throwWhom}
                                    label="Через кого"
                                    placeholder="Введите через кого"
                                    name="throwWhom"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.throwWhom}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    error={Boolean(formik.touched.warehouseDestinationId && formik.errors.warehouseDestinationId)}
                                    fullWidth
                                    helperText={formik.touched.warehouseDestinationId && formik.errors.warehouseDestinationId}
                                    label="Выберите склад назначения"
                                    name="warehouseDestinationId"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.warehouseDestinationId || ''}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                    disabled={!!displacement}
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
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider/>
                        <OverheadMaterialList/>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>
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
                            <Grid item xs={12} md={5}>
                                <OverheadImage images={images} setImages={setImages} imageFiles={imageFiles}
                                               setImageFiles={setImageFiles}/>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{float: 'right'}}>
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
                                onClick={formik.submitForm}
                                disabled={formik.isSubmitting}
                                sx={{width: 170}}
                            >
                                {displacement ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Form;