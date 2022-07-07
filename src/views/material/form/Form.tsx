import React, {useState} from 'react';
import {ICategoryOption, IMaterialMark, IMaterialRequest, IMaterialResponse} from "../../../models/IMaterial";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid, IconButton, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField
} from "@mui/material";
import {MaterialUnitEnum, MaterialUnitMap} from "../../../constants";
import {FiEdit, FiTrash} from "react-icons/fi";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import materialService from "../../../services/MaterialService";
import EditMarkModal from "./EditMarkModal";

const   Form: React.FC<{ material?: IMaterialResponse, categories: ICategoryOption[] }> = ({material, categories}) => {
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [editMark, setEditMark] = useState<IMaterialMark>()
    const [editMarkIndex, setEditMarkIndex] = useState<number>()
    const [marks, setMarks] = useState<IMaterialMark[]>(material?.marks || [])

    const handleDeleteMark = (index: number) => {
        let newMarks = [...marks]

        newMarks.splice(index, 1)
        setMarks(newMarks)
    }

    const handleEditMark = (mark: IMaterialMark, index: number) => {
        setEditMark(mark)
        setEditMarkIndex(index)
    }

    const handleAcceptEditMark = (values: IMaterialMark) => {
        let newMarks = [...marks]
        newMarks[editMarkIndex!] = {...newMarks[editMarkIndex!], ...values}
        setMarks(newMarks)
    }

    const markForm = useFormik<IMaterialMark>({
        initialValues: {
            name: '',
            sku: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required(),
            sku: Yup.string().max(255).required(),
        }),
        onSubmit: (values, {resetForm}) => {
            let newMarks = [...marks]
            newMarks.unshift(values)
            setMarks(newMarks)
            resetForm()
        }
    })

    const materialForm = useFormik<IMaterialRequest>({
        initialValues: {
            categoryId: material?.categoryId || categories[0].id,
            name: material?.name || '',
            unit: material?.unit || MaterialUnitEnum.TON,
            marks: []
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required(),
        }),
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.marks = marks

            try {
                if (material) {
                    values.id = material.id!

                    await materialService.putUpdateMaterial(values)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await materialService.postNewMaterial(values)

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

    return (
        <Card>
            <CardContent sx={{p: 3}}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    select
                                    error={Boolean(materialForm.touched.categoryId && materialForm.errors.categoryId)}
                                    fullWidth
                                    helperText={materialForm.touched.categoryId && materialForm.errors.categoryId}
                                    label="Категория"
                                    name="categoryId"
                                    onBlur={materialForm.handleBlur}
                                    onChange={materialForm.handleChange}
                                    required
                                    value={materialForm.values.categoryId}
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
                                    {categories.map(item => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    error={materialForm.touched.name && Boolean(materialForm.errors.name)}
                                    fullWidth
                                    helperText={materialForm.touched.name && materialForm.errors.name}
                                    label="Материал"
                                    placeholder="Введите материал"
                                    name="name"
                                    onBlur={materialForm.handleBlur}
                                    onChange={materialForm.handleChange}
                                    required
                                    value={materialForm.values.name}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <TextField
                                    select
                                    error={Boolean(materialForm.touched.unit && materialForm.errors.unit)}
                                    fullWidth
                                    helperText={materialForm.touched.unit && materialForm.errors.unit}
                                    label="ЕИ"
                                    name="unit"
                                    onBlur={materialForm.handleBlur}
                                    onChange={materialForm.handleChange}
                                    required
                                    value={materialForm.values.unit}
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
                                    {Object.keys(MaterialUnitEnum).map(item => (
                                        <MenuItem key={item} value={item}>
                                            {MaterialUnitMap.get(item as MaterialUnitEnum)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    error={markForm.touched.name && Boolean(markForm.errors.name)}
                                    fullWidth
                                    helperText={markForm.touched.name && markForm.errors.name}
                                    label="Марка"
                                    placeholder="Введите марку"
                                    name="name"
                                    onBlur={markForm.handleBlur}
                                    onChange={markForm.handleChange}
                                    required
                                    value={markForm.values.name}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    error={markForm.touched.sku && Boolean(markForm.errors.sku)}
                                    fullWidth
                                    helperText={markForm.touched.sku && markForm.errors.sku}
                                    label="Аритикуль"
                                    placeholder="Введите код товара"
                                    name="sku"
                                    onBlur={markForm.handleBlur}
                                    onChange={markForm.handleChange}
                                    required
                                    value={markForm.values.sku}
                                    variant="outlined"
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={markForm.submitForm}
                                    disabled={markForm.isSubmitting}
                                    sx={{width: '100%', paddingY: '15px'}}
                                >
                                    Добавить
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider/>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {marks.map((mark, index) => (
                                        <TableRow hover key={mark.sku}>
                                            <TableCell>{mark.name}</TableCell>
                                            <TableCell>{mark.sku}</TableCell>
                                            <TableCell sx={{width: 120, justifyContent:'flex-end'}}  >
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleEditMark(mark, index)}
                                                >
                                                    <FiEdit size={20}/>
                                                </IconButton>
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleDeleteMark(index)}
                                                >
                                                    <FiTrash size={20} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{float: 'right'}}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                type="button"
                                disabled={materialForm.isSubmitting}
                                onClick={() => navigate(-1)}
                                sx={{marginRight: 2, width: 170}}
                            >
                                Отмена
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={materialForm.submitForm}
                                disabled={materialForm.isSubmitting}
                                sx={{width: 170}}
                            >
                                {material ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            {editMark && <EditMarkModal mark={editMark} onClose={() => setEditMark(undefined)} onAccept={handleAcceptEditMark} />}
        </Card>
    );
};

export default Form;
