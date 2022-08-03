import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    Grid,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import CustomDatePicker from "../../../components/CustomDatePicker";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    changeEndDate, changePage, changeRowsPerPage, changeStartDate,
    getListError,
    getListPending,
    getListSuccess,
    reset,
    selectDisplacementList
} from "../../../store/reducers/displacementSlice";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import DisplacementService from "../../../services/DisplacementService";
import LoadingTableBody from "../../../components/LoadingTableBody";
import DetailButtonTable from "../../../components/DetailButtonTable";
import EditButtonTable from "../../../components/EditButtonTable";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";
import {selectAuth} from "../../../store/reducers/authSlice";
import TableSearch from "../../../components/TableSearch";
import {selectTableSearch} from "../../../store/reducers/tableSearchSlice";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DisplacementListView = () => {
    const {
        page,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        startDate,
        endDate,
    } = useAppSelector(selectDisplacementList)
    const {user} = useAppSelector(selectAuth)
    const {query} = useAppSelector(selectTableSearch)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => {
        dispatch(changePage(0))
    }, [query])

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await DisplacementService.getListDisplacement(page + 1, rowsPerPage, query, startDate, endDate )

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [ enqueueSnackbar, dispatch, page, rowsPerPage,  query, startDate, endDate])

    return (
        <>
            <Page title="Перемещение"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <Grid container spacing={3}>
                                        <Grid item>
                                            <TableSearch/>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={3}>
                                                <Grid item>
                                                    <CustomDatePicker changeDate={changeStartDate} label={'От'} />
                                                </Grid>
                                                <Grid item>
                                                    <CustomDatePicker changeDate={changeEndDate} label={'До'} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>№</TableCell>
                                                <TableCell>Накладная</TableCell>
                                                <TableCell>Дата</TableCell>
                                                <TableCell>Категория</TableCell>
                                                {!isWarehouseman && <TableCell>Сумма прихода</TableCell>}
                                                <TableCell>Склад </TableCell>
                                                <TableCell>Склад назначения</TableCell>
                                                <TableCell>Статус</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length > 0 ? (
                                                <TableBody>
                                                    {
                                                        rows.map(row => (
                                                            <TableRow hover key={row.id}>
                                                                <TableCell>{row.id}</TableCell>
                                                                <TableCell>{row.number}</TableCell>
                                                                <TableCell>{row.createdDate}</TableCell>
                                                                <TableCell>{row.categories.join(', ')}</TableCell>
                                                                {!isWarehouseman && <TableCell>{row.total}</TableCell>}
                                                                <TableCell>{row.currentWarehouse.name}</TableCell>
                                                                <TableCell>{row.destinationWarehouse}</TableCell>
                                                                <TableCell>
                                                                    <Box
                                                                        sx={{
                                                                            display: 'inline-block',
                                                                            backgroundColor: row.approved ? '#C5F2C7' : '#FF8075',
                                                                            borderRadius: 2,
                                                                            padding: '13px 11px',
                                                                        }}
                                                                    >
                                                                        {row.approved ? 'ЗАВЕРШЕН' : 'АКТИВНЫЙ'}
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell style={{ width: 120 }} align="right">
                                                                    {!row.approved && (row.currentWarehouse.id === user!.warehouse.id) && <EditButtonTable to={`/displacements/${row.id}/edit`} />}
                                                                    <DetailButtonTable to={`/displacements/${row.id}/materials`}/>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            ) : <LoadingTableBody loading={rowsLoading} error={rowsError}/>
                                        }
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                        <TablePagination
                            component="div"
                            count={rowsCount}
                            labelRowsPerPage={'Строк на странице:'}
                            page={page}
                            onPageChange={(event, newPage) => dispatch(changePage(newPage))}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onRowsPerPageChange={(event) => dispatch(changeRowsPerPage(parseInt(event.target.value, 10)))}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
                        />
                    </Card>
                </Container>
            </Root>
        </>
    );
};

export default DisplacementListView;
