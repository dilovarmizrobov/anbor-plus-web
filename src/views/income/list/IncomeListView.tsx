import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {
    Box,
    Card,
    Container, Grid,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {useSnackbar} from "notistack";
import {selectIncomeList} from "../../../store/reducers/incomeSlice";
import {
    reset,
    changeStartDate,
    changeEndDate,
    changePage,
    changeRowsPerPage,
    getListError,
    getListPending,
    getListSuccess
} from "../../../store/reducers/incomeSlice";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import incomeService from "../../../services/IncomeService";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingTableBody from "../../../components/LoadingTableBody";
import EditButtonTable from "../../../components/EditButtonTable";
import CustomDatePicker from "../../../components/CustomDatePicker";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const IncomeListView = () => {
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
    } = useAppSelector(selectIncomeList)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await incomeService.getListIncome(page + 1, rowsPerPage, startDate, endDate)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, startDate, endDate])

    return (
        <>
            <Page title="Приходы"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <CustomDatePicker changeDate={changeStartDate} label={'От'} />
                                        </Grid>
                                        <Grid item>
                                            <CustomDatePicker changeDate={changeEndDate} label={'До'} />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>№</TableCell>
                                                <TableCell>Дата</TableCell>
                                                <TableCell>Категория</TableCell>
                                                <TableCell>Сумма прихода</TableCell>
                                                <TableCell>От кого</TableCell>
                                                <TableCell>Комментарий</TableCell>
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
                                                                <TableCell>{row.createdDate}</TableCell>
                                                                <TableCell>{row.categories.join(", ")}</TableCell>
                                                                <TableCell>{row.total}</TableCell>
                                                                <TableCell>{row.fromWho}</TableCell>
                                                                <TableCell>{row.comment}</TableCell>
                                                                <TableCell style={{ width: 165 }}>
                                                                    <EditButtonTable
                                                                        to={`/incomes/${row.id}/edit`}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
                                                </TableBody>
                                            ) : <LoadingTableBody loading={rowsLoading} error={rowsError} />
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
    )
};

export default IncomeListView;