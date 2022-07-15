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
import {useAppSelector} from "../../../../store/hooks";
import {selectDisplacementMaterialList} from "../../../../store/reducers/displacementMaterialSlice";

const PriceHistoryModal: React.FC<{open: boolean, onClose: VoidFunction}> = ({open, onClose}) => {
    const {priceHistory} = useAppSelector(selectDisplacementMaterialList)

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
        >
            <DialogTitle>История изменения цены</DialogTitle>
            <DialogContent>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Дата</TableCell>
                            <TableCell>Цена</TableCell>
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
                <Button onClick={onClose}>
                    ОК
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default React.memo(PriceHistoryModal);
