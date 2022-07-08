import React, {useState} from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {
    Badge,
    Box,
    Button,
    Card,
    CardContent, CircularProgress, Divider,
    Grid, IconButton, InputAdornment,
    MenuItem,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    TextField
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {
    MaterialUnitMap,
    OutcomeTypeEnum,
    OutcomeTypeMap,
    PATH_OVERHEADS_IMAGE
} from "../../../constants";
import {FiEdit, FiPlusCircle, FiTrash} from "react-icons/fi";
import {IOutcomeMaterial, IOutcomeOption, IOutcomeRequest, IOutcomeResponse} from "../../../models/IOutcome";
import outcomeService from "../../../services/outcomeService";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useNavigate} from "react-router-dom";
import {MdClose} from "react-icons/md";
import {TbCameraPlus} from "react-icons/tb";
import MaterialFormModal from "./MaterialFormModal";


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

type ImageUrlType = {
    url: string;
    name?: string;
}

const toImageUrls = (imageNames: string[]) => imageNames.map(item => ({
    url: PATH_OVERHEADS_IMAGE + item,
    name: item
} as ImageUrlType))


const Form:React.FC<{ outcome?: IOutcomeResponse, prevProviders?: IOutcomeOption[] }> = ({outcome,prevProviders}) => {
    const ImageCount = 3;
    const [openModal, setOpenModal] = useState(false);
    const {enqueueSnackbar} = useSnackbar();
    const navigate = useNavigate();
    const [providers, setProviders] = useState<IOutcomeOption[]>(prevProviders || [])
    const [images, setImages] = useState<File[]>([])
    const [imageUrls, setImageUrls] = useState<ImageUrlType[]>(outcome ? toImageUrls(outcome.imageNames) : [])
    const [outcomeMaterials, setOutcomeMaterials] = useState<IOutcomeMaterial[]>(outcome?.overheadItems || [])
    const [outcomeMaterial, setOutcomeMaterial] = useState<IOutcomeMaterial>()
    const [outcomeMaterialIndex, setOutcomeMaterialIndex] = useState<number>()
    const [providerLoading, setProviderLoading] = useState(false)


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
            values.overheadItems = outcomeMaterials;

            try {
                if (outcome){
                    values.id = outcome.id!
                    let imageNames = imageUrls.filter(item => item.name).map(item => item.name!)
                    await outcomeService.putUpdateOutcome(values, images, imageNames)

                    enqueueSnackbar('Успешно обновлен', {variant: 'success'});
                    navigate(-1)
                }else{
                    await outcomeService.postNewOutcome(values, images)

                    enqueueSnackbar('Успешно создан', {variant: 'success'});
                    navigate(-1)
                }
            }catch (error: any) {
                setSubmitting(false)
                setStatus({success: false})

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    const getOptionOutcomeType = async(type: OutcomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const data: any = await outcomeService.getOptionOutcomeType(type) as IOutcomeOption[]

            setProviders(data)
            formik.setFieldValue('fromWhoId', 0)
            //console.log(data)
        }catch (error : any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        }finally {
            setProviderLoading(false)
        }
    }

    // const handleImageChange = (e:any) => {
    //     if (e.target.files) {
    //         const imageFile = Array.from(e.target.files).map((img: any) =>
    //             URL.createObjectURL(img)
    //         );
    //
    //         setImages((prevImages) => prevImages.concat(imageFile));
    //         Array.from(e.target.files).map(
    //             (img: any) => URL.revokeObjectURL(img) // avoid memory leak
    //         );
    //     }
    // };

    const handleDeleteImage = (index: number) => {
        let newOutcomeImage = [...images]
        newOutcomeImage.splice(index, 1)
        setImages(newOutcomeImage)

        let newImageUrls = [...imageUrls]
        newImageUrls.splice(index, 1)
        setImageUrls(newImageUrls)
    }

    const handleEditMaterial = (material: IOutcomeMaterial, index:number) => {
        setOutcomeMaterial(material)
        setOutcomeMaterialIndex(index)
        setOpenModal(true)
    }

    const handleDeleteMaterial = (sku: string) => {
        const newMaterials = [...outcomeMaterials]
        const index = outcomeMaterials.findIndex(item => item.mark!.sku === sku)

        newMaterials.splice(index, 1)
        setOutcomeMaterials(newMaterials)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
        setOutcomeMaterial(undefined)
        setOutcomeMaterialIndex(undefined)
    }

    const existMaterial = (material: IOutcomeMaterial) =>{
        return outcomeMaterials.find(item => item.materialId === material.materialId && item.markId === material.markId)
    }


    const addMaterial = (material: IOutcomeMaterial) => {
        let newOutcomeMaterial = [...outcomeMaterials];
        if(existMaterial(material)){
            enqueueSnackbar('Материал уже существует', {variant: 'info'})
            return
        }

        newOutcomeMaterial.push(material)
        setOutcomeMaterials(newOutcomeMaterial)
    }

    const editMaterial = (material: IOutcomeMaterial) =>{
        let newEditMaterial = [...outcomeMaterials]
        newEditMaterial[outcomeMaterialIndex!] = material
        setOutcomeMaterials(newEditMaterial)
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
                                    {
                                        outcomeMaterials.map((outcomematerial, index) => (
                                            <TableRow key={outcomematerial.mark!.sku}>
                                                <TableCell>{outcomematerial.material!.name}</TableCell>
                                                <TableCell>{outcomematerial.mark!.name}</TableCell>
                                                <TableCell>{outcomematerial.mark!.sku}</TableCell>
                                                <TableCell>{outcomematerial.qty} {MaterialUnitMap.get(outcomematerial.material!.unit)}</TableCell>
                                                <TableCell/>
                                                <TableCell sx={{width: 120}}>
                                                    <IconButton
                                                        size="large"
                                                        onClick={() => handleEditMaterial(outcomematerial, index)}
                                                    >
                                                        <FiEdit size={20} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="large"
                                                        onClick={() => handleDeleteMaterial(outcomematerial.mark!.sku)}
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
                                <Grid container spacing={3}>
                                    {
                                        imageUrls.map((imageUrl, index) => (
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
                                    {
                                        imageUrls.length < ImageCount && (
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
                                        )
                                    }
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
                                type="submit"
                            >
                                {outcome ? 'Сохранить' : 'Создать'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
            {
                openModal &&
                <MaterialFormModal open={openModal} material={outcomeMaterial} onClose={handleCloseModal} onAddAccept={addMaterial} onEditAccept={editMaterial} />
            }
        </Card>
    );
};

export default Form;
