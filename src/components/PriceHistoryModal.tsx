import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell, TableHead,
    TableRow
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import {selectMaterialPriceHistory, closePriceHistory} from "../store/reducers/materialPriceHistorySlice";

const PriceHistoryModal = () => {
    const dispatch = useAppDispatch()
    const {isOpen, priceHistory} = useAppSelector(selectMaterialPriceHistory)

    return (
        <Dialog
            open={isOpen}
            onClose={() => dispatch(closePriceHistory())}
            fullWidth
        >
            <DialogTitle>История изменения цены</DialogTitle>
            <DialogContent>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата</TableCell>
                            <TableCell>Цена (Прихода)</TableCell>
                            <TableCell>Изменил</TableCell>
                            <TableCell>Комментарий</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {priceHistory && priceHistory.map(price => (
                            <TableRow hover key={price.id}>
                                <TableCell>{price.createdDate}</TableCell>
                                <TableCell>{price.price}</TableCell>
                                <TableCell>{price.createdBy}</TableCell>
                                <TableCell>{price.comment || '-'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(closePriceHistory())}>
                    ОК
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(PriceHistoryModal);