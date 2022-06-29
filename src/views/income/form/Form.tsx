import React, {useState} from 'react';
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import {IIncomeMaterial, IIncomeOption, IIncomeRequest, IIncomeResponse} from "../../../models/IIncome";
import * as Yup from "yup";
import {IncomeTypeEnum, IncomeTypeMap, MaterialUnitMap, PATH_OVERHEADS_IMAGE} from "../../../constants";
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent, CircularProgress,
    Divider,
    Grid,
    IconButton, InputAdornment,
    MenuItem, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    TextField
} from "@mui/material";
import {TbCameraPlus} from "react-icons/tb";
import {MdClose} from "react-icons/md";
import {styled} from "@mui/material/styles";
import {FiEdit, FiPlusCircle, FiTrash} from "react-icons/fi";
import MaterialFormModal from "./MaterialFormModal";
import incomeService from "../../../services/IncomeService";
import errorMessageHandler from "../../../utils/errorMessageHandler";

const StyledImage = styled('div')(() => ({
    height: 70,
    width: 70,
    borderRadius: 10,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
}))

const StyledIconButton = styled(IconButton)(() => ({
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    padding: 1,
    '&:hover': {
        backgroundColor: 'white',
    }
}))

const StyledCameraPlusBox = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70,
    width: 70,
}))

interface ImageUrlType {
    url: string;
    name?: string;
}

const toImageUrls = (imageNames: string[]) => imageNames.map(item => ({
    url: PATH_OVERHEADS_IMAGE + item,
    name: item
} as ImageUrlType))

const Form: React.FC<{ income?: IIncomeResponse, prevProviders?: IIncomeOption[] }> = ({income, prevProviders}) => {
    const ImageCount = 3;
    const [openModal, setOpenModal] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [providers, setProviders] = useState<IIncomeOption[]>(prevProviders || [])
    const [images, setImages] = useState<File[]>([])
    const [imageUrls, setImageUrls] = useState<ImageUrlType[]>(income ? toImageUrls(income.imageNames) : [])
    const [incomeMaterials, setIncomeMaterials] = useState<IIncomeMaterial[]>(income?.overheadItems || [])
    const [incomeMaterial, setIncomeMaterial] = useState<IIncomeMaterial>()
    const [incomeMaterialIndex, setIncomeMaterialIndex] = useState<number>()
    const [providerLoading, setProviderLoading] = useState(false)

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
            values.overheadItems = incomeMaterials

            try {
                if (income) {
                    values.id = income.id!
                    let imageNames = imageUrls.filter(item => item.name).map(item => item.name!)

                    await incomeService.putUpdateIncome(values, images, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                } else {
                    await incomeService.postNewIncome(values, images)

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

    const handleDeleteImage = (index: number) => {
        let newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)

        let newImageUrls = [...imageUrls]
        newImageUrls.splice(index, 1)
        setImageUrls(newImageUrls)
    }

    const getOptionProviders = async (type: IncomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const providersData = await incomeService.getOptionProviders(type) as IIncomeOption[]

            setProviders(providersData)
            formik.setFieldValue('fromWhoId', 0)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

    const handleEditMaterial = (material: IIncomeMaterial, index: number) => {
        setIncomeMaterial(material)
        setIncomeMaterialIndex(index)
        setOpenModal(true)
    }

    const handleDeleteMaterial = (sku: string) => {
        let newIncomeMaterials = [...incomeMaterials]
        let index = incomeMaterials.findIndex(item => item.mark!.sku === sku)
        newIncomeMaterials.splice(index, 1)

        setIncomeMaterials(newIncomeMaterials)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setIncomeMaterial(undefined)
        setIncomeMaterialIndex(undefined)
    }

    const existMaterial = (material: IIncomeMaterial) => {
        return incomeMaterials.find(item => item.materialId === material.materialId && item.markId === material.markId)
    }

    const addMaterial = (material: IIncomeMaterial) => {
        let newIncomeMaterials = [...incomeMaterials]

        if (existMaterial(material)) {
            enqueueSnackbar('Материал уже существует', {variant: 'info'})
            return
        }

        newIncomeMaterials.push(material)

        setIncomeMaterials(newIncomeMaterials)
    }

    const editMaterial = (material: IIncomeMaterial) => {
        let newIncomeMaterials = [...incomeMaterials]
        newIncomeMaterials[incomeMaterialIndex!] = material
        setIncomeMaterials(newIncomeMaterials)
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
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Материал</TableCell>
                                        <TableCell>Марка</TableCell>
                                        <TableCell>Артикул</TableCell>
                                        <TableCell>Кол-во</TableCell>
                                        <TableCell/>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={() => setOpenModal(true)}
                                                >
                                                <FiPlusCircle size={20} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {incomeMaterials.map((incomeMaterial, index) => (
                                        <TableRow hover key={incomeMaterial.mark!.sku}>
                                            <TableCell>{incomeMaterial.material!.name}</TableCell>
                                            <TableCell>{incomeMaterial.mark!.name}</TableCell>
                                            <TableCell>{incomeMaterial.mark!.sku}</TableCell>
                                            <TableCell>{incomeMaterial.qty} {MaterialUnitMap.get(incomeMaterial.material!.unit)}</TableCell>
                                            <TableCell/>
                                            <TableCell sx={{width: 120}}>
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleEditMaterial(incomeMaterial, index)}
                                                >
                                                    <FiEdit size={20}/>
                                                </IconButton>
                                                <IconButton
                                                    size="large"
                                                    onClick={() => handleDeleteMaterial(incomeMaterial.mark!.sku)}
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
                                <Grid container spacing={3}>
                                    {imageUrls.map((imageUrl, index) => (
                                        <Grid item xs="auto" key={index}>
                                            <Badge
                                                badgeContent={
                                                    <StyledIconButton size="small" onClick={() => handleDeleteImage(index)}>
                                                        <MdClose size={14}/>
                                                    </StyledIconButton>
                                                }
                                            >
                                                <StyledImage sx={{backgroundImage: `url(${imageUrl.url})`}}/>
                                            </Badge>
                                        </Grid>
                                    ))}
                                    {imageUrls.length < ImageCount && (
                                        <Grid item xs="auto">
                                            <StyledCameraPlusBox>
                                                <label>
                                                    <input
                                                        multiple
                                                        accept="image/*"
                                                        type="file"
                                                        style={{display: "none"}}
                                                        onChange={(e) => {
                                                            let files = (e.target as HTMLInputElement).files!;
                                                            let newImageUrls = [...imageUrls]
                                                            let newImages = [...images]

                                                            for (let i = 0; i < files.length; i++) {
                                                                newImageUrls.push({url: URL.createObjectURL(files[i])} as ImageUrlType)
                                                                newImages.push(files[i])
                                                                if ((ImageCount - imageUrls.length) === i + 1) break;
                                                            }

                                                            setImageUrls(newImageUrls)
                                                            setImages(newImages);

                                                            (e.target as HTMLInputElement).value = ''
                                                        }}
                                                    />
                                                    <IconButton size="large" component="span">
                                                        <TbCameraPlus size={30}/>
                                                    </IconButton>
                                                </label>
                                            </StyledCameraPlusBox>
                                        </Grid>
                                    )}
                                </Grid>
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
            {openModal && (
                <MaterialFormModal material={incomeMaterial} open={openModal} onClose={handleCloseModal} onAddAccept={addMaterial} onEditAccept={editMaterial}/>
            )}
        </Card>
    );
};

export default Form;