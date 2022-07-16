import React from 'react';
import {Button, TableCell, TableRow, TextField} from "@mui/material";
import {MaterialUnitMap} from "../../../../constants";
import {styled} from "@mui/material/styles";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useFormik} from "formik";
import * as Yup from "yup";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";
import {
    editMaterial,
    setMaterialEditPrice,
    setPriceHistory
} from "../../../../store/reducers/displacementMaterialSlice";
import {IReqPriceEdit, IResListMaterial} from "../../../../models/Overhead";
import appService from "../../../../services/AppService";
import {selectAuth} from "../../../../store/reducers/authSlice";

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

const MaterialRow: React.FC<{row: IResListMaterial, warehouseDestinationId?: number, warehouseId?: number}> = ({row, warehouseDestinationId, warehouseId}) => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {user} = useAppSelector(selectAuth)
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    const handleClickPrice = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) => {
        stopPropagation(e)
        dispatch(setMaterialEditPrice({price: row.price!, materialId: row.id}))
    }

    const formik = useFormik<IReqPriceEdit>({
        initialValues: {
            itemId: row.id,
            price: 0,
            comment: ''
        },
        validationSchema: Yup.object({
            price: Yup.number().not([0], 'Выберите значение').required(),
        }),
        onSubmit: async (values, {setSubmitting}) => {
            try {
                let displacementMaterial = await appService.putMaterialPriceEdit(values) as IResListMaterial
                dispatch(editMaterial(displacementMaterial))
                enqueueSnackbar('Успешно обновлен', {variant: 'success'})
            } catch (error: any) {
                setSubmitting(false);

                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        }
    })

    return (
        <>
            <TableRow hover onClick={() => !isWarehouseman && row.price && dispatch(setPriceHistory(row.priceHistory))}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.material}</TableCell>
                <TableCell>{row.mark}</TableCell>
                <TableCell>{row.sku}</TableCell>
                <TableCell>{row.qty}</TableCell>
                <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                {!isWarehouseman && (warehouseDestinationId === user!.warehouse.id) && (
                    <>
                        <TableCell>{row.price || '-'}</TableCell>
                        <TableCell>{row.total || '-'}</TableCell>
                    </>
                )}
                {!isWarehouseman && (warehouseId === user!.warehouse.id) && (
                    <>
                        <TableCell style={{ width: 140 }}>
                            {row.price ? (
                                row.priceHistory.length > 1 ? (
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
                                        {row.price}
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
                                        {row.price}
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
                            )}
                        </TableCell>
                        <TableCell>{row.total || '-'}</TableCell>
                    </>
                )}
            </TableRow>
        </>
    );
};

export default MaterialRow;
