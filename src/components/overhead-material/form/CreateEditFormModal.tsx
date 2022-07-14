import React, {useEffect, useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Autocomplete,
    Button, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    InputAdornment, MenuItem,
    TextField, Typography
} from "@mui/material";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import appService from "../../../services/AppService";
import useDebounce from "../../../hooks/useDebounce";
import {MaterialUnitMap} from "../../../constants";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    addMaterial,
    editMaterial,
    selectOverheadMaterial,
    setOpenModal
} from "../../../store/reducers/overheadMaterialSlice";
import {IOverheadMaterial, IOverheadMaterialMarkOption, IOverheadMaterialOption} from "../../../models/Overhead";

const CreateEditFormModal = () => {
    const {enqueueSnackbar} = useSnackbar()
    const {material} = useAppSelector(selectOverheadMaterial)
    const dispatch = useAppDispatch()
    const [materialOptions, setMaterialOptions] = useState<IOverheadMaterialOption[]>([])
    const [materialLoading, setMaterialLoading] = useState(false)
    const [marks, setMarks] = useState<IOverheadMaterialMarkOption[]>([])
    const [markLoading, setMarkLoading] = useState(false)
    const [query, setQuery] = useState('')
    const debouncedQuery = useDebounce(query, 500)

    const formik = useFormik<IOverheadMaterial>({
        initialValues: {
            qty: material?.qty || 0,
            markId: material?.markId || 0,
            mark: material?.mark,
            materialId: material?.materialId || 0,
            material: material?.material
        },
        validationSchema: Yup.object({
            qty: Yup.number().not([0], 'Выберите значение').required(),
            materialId: Yup.number().not([0], 'Выберите значение').required(),
            markId: Yup.number().not([0], 'Выберите значение').required(),
        }),
        onSubmit: (values) => {
            if (material) {
                values.id = material.id
                dispatch(editMaterial(values))
            } else dispatch(addMaterial(values))

            dispatch(setOpenModal(false))
        }
    })

    useEffect(() => {
        if (material) {
            (async () => {
                try {
                    setMaterialLoading(true)
                    setMarkLoading(true)

                    const materialOptionsData = await appService.getOptionMaterials(material.material!.name) as IOverheadMaterialOption[]
                    const marksData = await appService.getOptionMarks(material.materialId!) as IOverheadMaterialMarkOption[]

                    setMaterialOptions(materialOptionsData)
                    setMarks(marksData)
                } catch (error: any) {
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                } finally {
                    setMaterialLoading(false)
                    setMarkLoading(false)
                }
            })()
        }
    }, [])

    useEffect(() => {
        if (query !== formik.values.material?.name) {
            (async () => {
                try {
                    setMaterialLoading(true)
                    const materialOptionsData = await appService.getOptionMaterials(debouncedQuery) as IOverheadMaterialOption[]

                    setMaterialOptions(materialOptionsData)
                } catch (error: any) {
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                } finally {
                    setMaterialLoading(false)
                }
            })()
        }
    }, [debouncedQuery, enqueueSnackbar])

    const getOptionMarks = async (materialId: number) => {
        try {
            setMarkLoading(true)
            const marksData = await appService.getOptionMarks(materialId) as IOverheadMaterialMarkOption[]

            if (marksData.length === 0) enqueueSnackbar('Добавьте с начала марки', {variant: 'info'})

            setMarks(marksData)
            formik.setFieldValue('markId', 0)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setMarkLoading(false)
        }
    }

    return (
        <Dialog
            open={true}
            onClose={() => dispatch(setOpenModal(false))}
            fullWidth
        >
            <DialogTitle>{material ? 'Изменение' : 'Добавление'} материала</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ pt: 1 }}>
                    <Grid item xs={12} md={6}>
                        <Autocomplete
                            value={formik.values.material || null}
                            inputValue={query}
                            noOptionsText={'Не найдено ни одной записи'}
                            onChange={(event, value) => {
                                if (value) {
                                    formik.setFieldValue('materialId', value.id)
                                    formik.setFieldValue('material', value)
                                    getOptionMarks(value.id)
                                } else {
                                    formik.setFieldValue('materialId', 0)
                                    formik.setFieldValue('material', undefined)
                                }

                                formik.setFieldValue('mark', undefined)
                            }}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(option) => option.name}
                            options={materialOptions}
                            loading={materialLoading}
                            onInputChange={(event, newInputValue) => {
                                setQuery(newInputValue)
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Материал"
                                    helperText={formik.touched.materialId && formik.errors.materialId}
                                    error={Boolean(formik.touched.materialId && formik.errors.materialId)}
                                    InputLabelProps={{shrink: true}}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {materialLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            error={Boolean(formik.touched.markId && formik.errors.markId)}
                            fullWidth
                            helperText={formik.touched.markId && formik.errors.markId}
                            label="Марка"
                            name="markId"
                            onBlur={formik.handleBlur}
                            onChange={(e) => {
                                formik.handleChange(e)
                                const mark = marks.find((mark) => mark.id === Number(e.target.value))
                                formik.setFieldValue('mark', mark)
                            }}
                            required
                            value={(marks.length !== 0 && formik.values.markId) || ''}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                            disabled={marks.length === 0}
                            InputProps={markLoading ? {
                                endAdornment: (
                                    <InputAdornment position="start">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                )
                            } : undefined}
                            sx={{
                                '& .MuiSelect-icon': {
                                    visibility: markLoading ? 'hidden' : 'visible'
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
                            {marks.map((item, index) => (
                                <MenuItem key={index} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Артикул"
                            placeholder="Введите код товара"
                            name="sku"
                            required
                            value={formik.values.mark?.sku || ''}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                            disabled
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs>
                                <TextField
                                    error={formik.touched.qty && Boolean(formik.errors.qty)}
                                    fullWidth
                                    helperText={formik.touched.qty && formik.errors.qty}
                                    label="Количество"
                                    placeholder="Введите количество"
                                    name="qty"
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    required
                                    value={formik.values.qty || ''}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end">{formik.values.material && MaterialUnitMap.get(formik.values.material.unit)}</InputAdornment>
                                    }}
                                />
                            </Grid>
                            {formik.values.mark && (
                                <Grid item>
                                    <Typography>
                                        ост. {marks.find(m => m.id === formik.values.mark?.id)?.balance}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(setOpenModal(false))}>
                    Отмена
                </Button>
                <Button onClick={formik.submitForm}>
                    {material ? 'Сохранить' : 'Создать'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateEditFormModal;