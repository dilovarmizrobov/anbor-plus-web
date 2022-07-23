import React, {useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
} from "@mui/material";
import {FiEdit, FiPlusCircle, FiTrash} from "react-icons/fi";
import {IGarageInfo, ITechniqueRequest, ITechniqueResponse} from "../../../models/ITechnique";
import {IDataOption} from "../../../models";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import techniqueService from "../../../services/TechniqueService";
import EditTechniqueModal from "./EditTechniqueModal";

const Form:React.FC<{technique?: ITechniqueResponse, categories: IDataOption[]}> = ({technique, categories}) => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [editTechnique, setEditTechnique] = useState<IGarageInfo>()
    const [editTechniqueIndex, setEditTechniqueIndex] = useState<number>()
    const [infos, setInfos] = useState<IGarageInfo[]>(technique?.infos || [])

    const handleDelete = (index: number) => {
       const newInfo =  [...infos]

        newInfo.splice(index, 1)
        setInfos(newInfo)
    }

    const handleEditMark = (info: IGarageInfo, index: number) => {
        setEditTechnique(info)
        setEditTechniqueIndex(index)
    }

    const handleAcceptEditTechnique = (values: IGarageInfo) => {
        let newInfo = [...infos]
        newInfo[editTechniqueIndex!] = {...newInfo[editTechniqueIndex!], ...values}
        setInfos(newInfo)
    }

    const garageForm = useFormik<IGarageInfo>({
        initialValues: {
            number: '',
            incomeDate: '',
            releaseYear: '',
        },
        validationSchema: Yup.object({
            number : Yup.string().max(255).required(),
            incomeDate : Yup.string().max(255).required(),
            releaseYear : Yup.string().max(255).required(),
        }),
        onSubmit: (values, {resetForm}) => {
            let newGarage = [...infos]

            newGarage.unshift(values)
            setInfos(newGarage)
            resetForm()
        }
    })

    const techniqueForm = useFormik<ITechniqueRequest>({
        initialValues: {
            technicCategoryId: technique?.technicCategoryId || categories[0].id,
            name: technique?.name || '',
            infos: []
        },
        validationSchema: Yup.object({
            name: Yup.string().max(255).required()
        }),
        onSubmit: async (values, {setSubmitting, setStatus}) => {
            values.infos = infos

                try {
                    if (technique){
                        values.id = technique.id!

                        await techniqueService.putUpdateTechnique(values)
                        enqueueSnackbar('Успешно обновлен', {variant: 'success'})
                        navigate(-1)
                    }else {
                       await techniqueService.postNewTechnique(values)
                        enqueueSnackbar('Успешно обновлен', {variant: 'success'})
                        navigate(-1)
                    }

                }catch (error :any) {
                    setStatus({success: false})
                    setSubmitting(false)

                    enqueueSnackbar((error), {variant: 'error'})
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
                                    error={Boolean(techniqueForm.touched.technicCategoryId && techniqueForm.errors.technicCategoryId)}
                                    fullWidth
                                    helperText={techniqueForm.touched.technicCategoryId && techniqueForm.errors.technicCategoryId}
                                    label="Категория"
                                    placeholder="Выберите категорию"
                                    onBlur={techniqueForm.handleBlur}
                                    onChange={techniqueForm.handleChange}
                                    name="technicCategoryId"
                                    variant="outlined"
                                    value={techniqueForm.values.technicCategoryId}
                                    required
                                    InputLabelProps={{ shrink: true }}
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
                                        categories.map(item => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    }
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} mt={2}>
                            <Grid item xs={12} md={5}>
                                <TextField
                                    fullWidth
                                    error={Boolean(techniqueForm.touched.name && techniqueForm.errors.name)}
                                    label="Имя техники"
                                    helperText={techniqueForm.touched.name && techniqueForm.errors.name}
                                    placeholder="Введите имя техники"
                                    name="name"
                                    onBlur={techniqueForm.handleBlur}
                                    onChange={techniqueForm.handleChange}
                                    value={techniqueForm.values.name}
                                    variant="outlined"
                                    required
                                    InputLabelProps={{shrink: true}}
                                />
                            </Grid>
                            {/*<Grid item xs={12} md={2}>*/}
                            {/*    <Typography variant="h5">шт</Typography>*/}
                            {/*</Grid>*/}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={garageForm.touched.number && Boolean(garageForm.errors.number)}
                                    fullWidth
                                    helperText={garageForm.touched.number && garageForm.errors.number}
                                    label="Гаражный номер"
                                    onBlur={garageForm.handleBlur}
                                    onChange={garageForm.handleChange}
                                    name="number"
                                    value={garageForm.values.number}
                                    variant="outlined"
                                    placeholder="Введите  номер"
                                    InputLabelProps={{shrink: true}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    error={garageForm.touched.incomeDate && Boolean(garageForm.errors.incomeDate)}
                                    fullWidth
                                    helperText={garageForm.touched.incomeDate && garageForm.errors.incomeDate}
                                    label="Дата прихода"
                                    onBlur={garageForm.handleBlur}
                                    onChange={garageForm.handleChange}
                                    name = "incomeDate"
                                    type="date"
                                    value={garageForm.values.incomeDate}
                                    variant="outlined"
                                    placeholder="Введите дату прихода"
                                    InputLabelProps={{shrink: true}}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <TextField
                                    error={Boolean(garageForm.touched.releaseYear && garageForm.errors.releaseYear)}
                                    fullWidth
                                    helperText={garageForm.touched.releaseYear && garageForm.errors.releaseYear}
                                    label="Год выпуска"
                                    placeholder="Выберите год"
                                    variant="outlined"
                                    name="releaseYear"
                                    value={garageForm.values.releaseYear}
                                    onBlur={garageForm.handleBlur}
                                    onChange={garageForm.handleChange}
                                    required
                                    InputLabelProps={{shrink: true}}
                                />

                            </Grid>
                            <Grid item xs={12} md={1}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={garageForm.submitForm}
                                >
                                    <FiPlusCircle size={20} />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider/>
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {
                                        infos.map((item, index) => (
                                            <TableRow hover key={item.number}>
                                                <TableCell>{index + 1}</TableCell>
                                                <TableCell>{item.number}</TableCell>
                                                <TableCell>{item.incomeDate}</TableCell>
                                                <TableCell>{item.releaseYear}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="large"
                                                        onClick={() => handleEditMark(item, index)}
                                                    >
                                                        <FiEdit size={20} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="large"
                                                        onClick={() => handleDelete(index)}
                                                    >
                                                        <FiTrash size={20} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
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
                                disabled={techniqueForm.isSubmitting}
                                onClick={() => navigate(-1)}
                                sx={{marginRight: 2, width: 170}}
                            >
                                Отмена
                            </Button>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={techniqueForm.submitForm}
                                disabled={techniqueForm.isSubmitting}
                                sx={{width: 170}}
                            >
                                Сохранить
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            {editTechnique && <EditTechniqueModal info={editTechnique} onClose={() => setEditTechnique(undefined)} onAccept={handleAcceptEditTechnique}/> }
        </Card>
    );
};

export default Form;
