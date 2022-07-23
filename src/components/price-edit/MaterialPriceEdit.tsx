import React from 'react';
import {styled} from "@mui/material/styles";
import {Button, TextField} from "@mui/material";
import {useAppDispatch} from "../../store/hooks";
import {useSnackbar} from "notistack";
import {openMaterialPriceEditModal} from "../../store/reducers/materialPriceEditSlice";
import {useFormik} from "formik";
import {IReqPriceEdit} from "../../models/Overhead";
import * as Yup from "yup";
import errorMessageHandler from "../../utils/errorMessageHandler";

const PriceTextField = styled(TextField)({
    width: 92,
    '& .MuiOutlinedInput-root': {
        '& .MuiOutlinedInput-input': {
            color: '#FFFFFF',
            backgroundColor: '#FF8075',
            borderRadius: 'inherit',
        },
        '& .MuiOutlinedInput-input:hover, & .MuiOutlinedInput-input:focus': {
            color: 'inherit',
            backgroundColor: 'inherit',
        },
        '& fieldset': {
            borderColor: '#FF8075',
        },
        '&:hover fieldset': {
            borderColor: '#FF8075',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FF8075',
        },
    },
});

const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
}

interface MaterialPriceEditProps {
    price: number | undefined;
    materialId: number;
    priceHistoryLength: number;
    onEditPrice: Function;
    handleEditPrice: Function;
}

const MaterialPriceEdit: React.FC<MaterialPriceEditProps> = ({price, materialId, priceHistoryLength, onEditPrice, handleEditPrice}) => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()

    const handleClickPrice = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(e)
        dispatch(openMaterialPriceEditModal({price: price!, materialId}))
    }

    const formik = useFormik<IReqPriceEdit>({
        initialValues: {
            itemId: materialId,
            price: 0,
            comment: ''
        },
        validationSchema: Yup.object({
            price: Yup.number().not([0], 'Выберите значение').required(),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            try {
                let data = await onEditPrice(values)
                handleEditPrice(data)
                enqueueSnackbar('Успешно обновлен', {variant: 'success'})
            } catch (error: any) {
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    return price ? (
        priceHistoryLength > 1 ? (
            <Button
                onClick={handleClickPrice}
                variant="contained"
                sx={{
                    width: 92,
                    backgroundColor: '#F0F409',
                    color: '#263238',
                    '&:hover': {
                        backgroundColor: '#e0e30d',
                        color: '#263238',
                    }
                }}
            >
                {price}
            </Button>
        ) : (
            <Button
                onClick={handleClickPrice}
                variant="contained"
                sx={{
                    width: 92,
                    backgroundColor: '#C5F2C7',
                    color: '#263238',
                    '&:hover': {
                        backgroundColor: '#b2e3b4',
                        color: '#263238',
                    }
                }}
            >
                {price}
            </Button>
        )
    ) : (
        <PriceTextField
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
            placeholder='-'
            hiddenLabel
            variant="outlined"
            size="small"
            name="price"
            value={formik.values.price || ''}
            onChange={formik.handleChange}
            onClick={stopPropagation}
            onKeyDown={(e) => (e.code === 'Enter') && formik.submitForm()}
        />
    )
};

export default MaterialPriceEdit;