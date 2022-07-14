import React, {useEffect, useState} from 'react';
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {IIncomeRequest, IIncomeResponse} from "../../../models/IIncome";
import * as Yup from "yup";
import {IncomeTypeEnum, IncomeTypeMap} from "../../../constants";
import {
    Box,
    Button,
    Card,
    CardContent, CircularProgress,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";
import incomeService from "../../../services/IncomeService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {reset, selectOverheadMaterial} from "../../../store/reducers/overheadMaterialSlice";
import OverheadMaterialList from "../../../components/overhead-material/form";
import {IDataOption} from "../../../models";
import OverheadImage, {IOverheadImage, mapToImages} from "../../../components/OverheadImage";

const Form: React.FC<{ income?: IIncomeResponse, prevProviders?: IDataOption[] }> = ({income, prevProviders}) => {
    const {materials} = useAppSelector(selectOverheadMaterial)
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [images, setImages] = useState<IOverheadImage[]>(income ? mapToImages(income.imageNames) : [])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [providers, setProviders] = useState<IDataOption[]>(prevProviders || [])
    const [providerLoading, setProviderLoading] = useState(false)

    useEffect(() => () => {dispatch(reset())}, [])

    const formik = useFormik<IIncomeRequest>({
        initialValues: {
            autoDetail: income?.autoDetail || '',
            throwWhom: income?.throwWhom || '',
            typeFrom: income?.typeFrom || '' as IncomeTypeEnum,
            fromWhoId: income?.fromWhoId || 0,
            comment: income?.comment || '',
            images: [],
            overheadItems: []
        },
        validationSchema: Yup.object({
            autoDetail: Yup.string().max(255).required('Введите значение'),
            throwWhom: Yup.string().max(255).required('Введите значение'),
            typeFrom: Yup.mixed<IncomeTypeEnum>().oneOf(Object.values(IncomeTypeEnum)).required('Выберите значение'),
            fromWhoId: Yup.number().not([0], 'Выберите значение').required(),
        }),
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.overheadItems = materials

            try {
                if (income) {
                    values.id = income.id!
                    let imageNames = images.filter(item => item.name).map(item => item.name!)

                    await incomeService.putUpdateIncome(values, imageFiles, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await incomeService.postNewIncome(values, imageFiles)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                    navigate(-1)
                }
            } catch (error: any) {
                setStatus({success: false});
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    const getOptionProviders = async (type: IncomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const providersData = await incomeService.getOptionProviders(type) as IDataOption[]

            setProviders(providersData)
            formik.setFieldValue('fromWhoId', 0)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

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
                                    error={Boolean(formik.touched.typeFrom && formik.errors.typeFrom)}
                                    fullWidth
                                    helperText={formik.touched.typeFrom && formik.errors.typeFrom}
                                    label="Выберите тип"
                                    name="typeFrom"
                                    onBlur={formik.handleBlur}
                                    onChange={(e) => {
                                        formik.handleChange(e)
                                        getOptionProviders(e.target.value as IncomeTypeEnum)
                                    }}
                                    required
                                    value={formik.values.typeFrom}
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
                                    {Object.keys(IncomeTypeEnum).map(item => (
                                        <MenuItem key={item} value={item}>
                                            {IncomeTypeMap.get(item as IncomeTypeEnum)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    error={Boolean(formik.touched.fromWhoId && formik.errors.fromWhoId)}
                                    fullWidth
                                    helperText={formik.touched.fromWhoId && formik.errors.fromWhoId}
                                    label="Выберите Снабженца/Предприятие/Объект"
                                    name="fromWhoId"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.fromWhoId || ''}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                    disabled={providers.length === 0 || providerLoading}
                                    InputProps={providerLoading ? {
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <CircularProgress size={20} />
                                            </InputAdornment>
                                        )
                                    } : undefined}
                                    sx={{
                                        '& .MuiSelect-icon': {
                                            visibility: providerLoading ? 'hidden' : 'visible'
                                        }
                                    }}
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
                                    {providers.map(item => (
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
                                {income ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Form;