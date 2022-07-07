import React from 'react';
import {IResWarehouseBalance} from "../../models";
import {IconButton, TableCell, TableRow} from "@mui/material";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from 'react-icons/md';
import {MaterialUnitMap} from "../../constants";

const MaterialRow: React.FC<{row: IResWarehouseBalance}> = ({row}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow hover>
                <TableCell width={10}>{row.id}</TableCell>
                <TableCell width={40}>
                    <IconButton
                        aria-label="expand row"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
            </TableRow>
            {open && row.marks.map((mark) => (
                <TableRow hover key={mark.id}>
                    <TableCell sx={{borderBottom: 0}}/>
                    <TableCell sx={{borderBottom: 0}}/>
                    <TableCell>{mark.name + ', ' + mark.sku}</TableCell>
                    <TableCell>{mark.amount}</TableCell>
                    <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                </TableRow>
            ))}
        </>
    );
};

export default React.memo(MaterialRow);