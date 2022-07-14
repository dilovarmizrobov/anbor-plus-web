import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    Card,
    CardContent, CircularProgress, Divider,
    Grid, InputAdornment,
    MenuItem,
    TextField
} from "@mui/material";
import {
    OutcomeTypeEnum,
    OutcomeTypeMap,
} from "../../../constants";
import {IOutcomeRequest, IOutcomeResponse} from "../../../models/IOutcome";
import outcomeService from "../../../services/outcomeService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useNavigate} from "react-router-dom";
import {IDataOption} from "../../../models";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {reset, selectOverheadMaterial} from "../../../store/reducers/overheadMaterialSlice";
import OverheadMaterialList from "../../../components/overhead-material/form";
import OverheadImage, {IOverheadImage, mapToImages} from "../../../components/OverheadImage";

const Form:React.FC<{ outcome?: IOutcomeResponse, prevProviders?: IDataOption[] }> = ({outcome,prevProviders}) => {
    const {materials} = useAppSelector(selectOverheadMaterial)
    const {enqueueSnackbar} = useSnackbar();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const [providers, setProviders] = useState<IDataOption[]>(prevProviders || [])
    const [images, setImages] = useState<IOverheadImage[]>(outcome ? mapToImages(outcome.imageNames) : [])
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [providerLoading, setProviderLoading] = useState(false)

    useEffect(() => () => {dispatch(reset())}, [])

    const formik = useFormik<IOutcomeRequest>({
        initialValues: {
            autoDetail: outcome?.autoDetail || '',
            throwWhom: outcome?.throwWhom || '',
            fromWhoId: outcome?.fromWhoId || 0,
            comment: outcome?.comment || '',
            typeFrom: outcome?.typeFrom || '' as OutcomeTypeEnum,
            images: [],
            overheadItems: [],
        },
        validationSchema: Yup.object({
            autoDetail: Yup.string().max(255).required(),
            throwWhom: Yup.string().max(255).required(),
            fromWhoId: Yup.number().not([0], 'Выберите значение').required(),
            typeFrom: Yup.mixed<OutcomeTypeEnum>().oneOf(Object.values(OutcomeTypeEnum)).required('Выберите значение'),
        }),

        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.overheadItems = materials;

            try {
                if (outcome) {
                    values.id = outcome.id!
                    let imageNames = images.filter(item => item.name).map(item => item.name!)

                    await outcomeService.putUpdateOutcome(values, imageFiles, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await outcomeService.postNewOutcome(values, imageFiles)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                    navigate(-1)
                }
            } catch (error: any) {
                setSubmitting(false)
                setStatus({success: false})

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    const getOptionOutcomeType = async(type: OutcomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const data: any = await outcomeService.getOptionOutcomeType(type) as IDataOption[]

            setProviders(data)
            formik.setFieldValue('fromWhoId', 0)
        } catch (error : any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

    return (
        <Card>
            <CardContent>
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
                                    error={formik.touched.typeFrom && Boolean(formik.errors.typeFrom)}
                                    fullWidth
                                    helperText={formik.touched.typeFrom && formik.errors.typeFrom}
                                    label="Выберите тип"
                                    placeholder="Выберите тип"
                                    name="typeFrom"
                                    onBlur={formik.handleBlur}
                                    onChange={e => {
                                    formik.handleChange(e)
                                        getOptionOutcomeType(e.target.value as OutcomeTypeEnum)
                                    }}
                                    required
                                    variant="outlined"
                                    value={formik.values.typeFrom}
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
                                    {
                                        Object.keys(OutcomeTypeEnum).map(item => (
                                            <MenuItem key={item} value={item}>
                                                {OutcomeTypeMap.get(item as OutcomeTypeEnum)}
                                            </MenuItem>
                                        ))
                                    }

                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    error={formik.touched.fromWhoId && Boolean(formik.errors.fromWhoId)}
                                    fullWidth
                                    helperText={formik.touched.fromWhoId && formik.errors.fromWhoId}
                                    label="Выберите Предприятие/Обьект"
                                    placeholder="Выберите Предприятие/Обьект"
                                    name="fromWhoId"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.fromWhoId || ''}
                                    variant="outlined"
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
                        <Divider />
                        <OverheadMaterialList/>
                    </Grid>
                    <Grid item xs={12} >
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={7}>
                                <TextField
                                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                                    variant="outlined"
                                    helperText={formik.touched.comment && formik.errors.comment}
                                    label="Комментарий"
                                    fullWidth
                                    multiline
                                    name="comment"
                                    rows={2}
                                    placeholder="Комментарий"
                                    value={formik.values.comment}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
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
                                type="submit"
                            >
                                {outcome ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Form;
