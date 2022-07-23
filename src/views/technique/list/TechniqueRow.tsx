import React from 'react';
import {ITechniqueResponse} from "../../../models/ITechnique";
import {IconButton, TableCell, TableRow} from "@mui/material";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import EditButtonTable from "../../../components/EditButtonTable";

const TechniqueRow : React.FC<{row: ITechniqueResponse}> = ({row}) => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <TableRow hover key={row.id}>
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
                <TableCell/>
                <TableCell/>
                <TableCell/>
                <TableCell align="right">
                    <EditButtonTable
                        to={`/techniques/${row.id}/edit`}
                    />
                </TableCell>
            </TableRow>
            {open && row.infos.map((info) => (
                <TableRow hover key={info.id}>
                    <TableCell sx={{borderBottom: 0}}/>
                    <TableCell sx={{borderBottom: 0}}/>
                    <TableCell sx={{borderBottom: 0}}/>
                    <TableCell>{info.number}</TableCell>
                    <TableCell>{info.releaseYear}</TableCell>
                    <TableCell>{info.incomeDate}</TableCell>
                    <TableCell/>
                </TableRow>
            ))}
        </>
    );
};

export default TechniqueRow;
