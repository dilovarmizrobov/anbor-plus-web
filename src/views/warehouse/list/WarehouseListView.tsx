import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow,
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
    deleteRow, getListWarehouseError, getListWarehousePending, getListWarehouseSuccess, reset, selectWarehouseList
} from "../../../store/reducers/warehouseSlice";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingTableBody from "../../../components/LoadingTableBody";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import EditButtonTable from "../../../components/EditButtonTable";
import warehouseService from "../../../services/WarehouseService";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const WarehouseListView = () => {
    const {rowsLoading, rowsError, rows} = useAppSelector(selectWarehouseList)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => () => {dispatch(reset())}, [dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListWarehousePending())

                const data: any = await warehouseService.getListWarehouse()

                if (!cancel) dispatch(getListWarehouseSuccess(data))
            } catch (error: any) {
                dispatch(getListWarehouseError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, dispatch])

    return (
        <>
            <Page title="Склады"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750}>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Название</TableCell>
                                                <TableCell>Предприятие</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        {rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map(row => (
                                                    <TableRow hover key={row.id}>
                                                        <TableCell>{row.name}</TableCell>
                                                        <TableCell>{row.enterpriseName}</TableCell>
                                                        <TableCell sx={{width: 120}}>
                                                            <EditButtonTable to={`/warehouses/${row.id}/edit`} />
                                                            <DeleteButtonTable
                                                                rowId={row.id}
                                                                onDelete={warehouseService.deleteWarehouse}
                                                                handleDelete={(rowId: number) => dispatch(deleteRow(rowId))}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        ) : <LoadingTableBody loading={rowsLoading} error={rowsError}/>}
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                    </Card>
                </Container>
            </Root>
        </>
    );
};

export default WarehouseListView;