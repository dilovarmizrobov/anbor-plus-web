import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {reset, selectOverheadMaterial} from "../../../store/reducers/overheadMaterialSlice";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import OverheadImage, {IOverheadImage, mapToImages} from "../../../components/OverheadImage";
import {useFormik} from "formik";
import * as Yup from "yup";
import errorMessageHandler from "../../../utils/errorMessageHandler";
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
import {IReqOperation, IResOperation} from "../../../models/Operation";
import {OperationTypeEnum, OperationTypeMap} from "../../../constants";
import operationService from "../../../services/operationService";

const Form: React.FC<{operation?: IResOperation}> = ({operation}) => {
    const {materials} = useAppSelector(selectOverheadMaterial)
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [images, setImages] = useState<IOverheadImage[]>(operation ? mapToImages(operation.imageNames) : [])
    const [imageFiles, setImageFiles] = useState<File[]>([])

    useEffect(() => () => {dispatch(reset())}, [])

    const formik = useFormik<IReqOperation>({
        initialValues: {
            type: operation?.type || '' as OperationTypeEnum,
            act: operation?.act || '',
            comment: operation?.comment || '',
            images: [],
            overheadItems: []
        },
        validationSchema: Yup.object({
            act: Yup.string().max(255).required('Введите значение'),
            type: Yup.mixed<OperationTypeEnum>().oneOf(Object.values(OperationTypeEnum)).required('Выберите значение'),
        }),
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.overheadItems = materials

            try {
                if (operation) {
                    values.id = operation.id
                    let imageNames = images.filter(item => item.name).map(item => item.name!)

                    await operationService.putUpdateOperation(values, imageFiles, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                } else {
                    await operationService.postNewOperation(values, imageFiles)

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
                                    select
                                    error={Boolean(formik.touched.type && formik.errors.type)}
                                    fullWidth
                                    helperText={formik.touched.type && formik.errors.type}
                                    label="Выберите тип"
                                    name="type"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.type}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                    disabled={!!operation}
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
                                    {Object.keys(OperationTypeEnum).map(item => (
                                        <MenuItem key={item} value={item}>
                                            {OperationTypeMap.get(item as OperationTypeEnum)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={formik.touched.act && Boolean(formik.errors.act)}
                                    fullWidth
                                    helperText={formik.touched.act && formik.errors.act}
                                    label="Номер акта"
                                    placeholder="Введите номер акта"
                                    name="act"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.act}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
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
                                {operation ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Form;