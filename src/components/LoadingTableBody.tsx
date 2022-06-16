import React from "react";
import {CircularProgress, TableBody, TableCell, TableRow, Typography} from "@mui/material";

const LoadingTableBody: React.FC<{loading: boolean, error: boolean}> = ({loading, error}) => (
    <TableBody>
        <TableRow>
            <TableCell colSpan={50} align="center" sx={{height: 250}}>
                {error && <Typography>Произошла непредвиденная ошибка. Повторите попытку позже</Typography>}
                {loading && <CircularProgress size={48}/>}
                {!error && !loading && <Typography display="block">Не найдено ни одной записи</Typography>}
            </TableCell>
        </TableRow>
    </TableBody>
)

export default LoadingTableBody
