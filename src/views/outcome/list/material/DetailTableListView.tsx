import React, {useEffect} from 'react';
import Page from "../../../../components/Page";
import {styled} from "@mui/material/styles";
import {
    Box,
    Card,
    Container, Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useSnackbar} from "notistack";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useParams} from "react-router-dom";
import {
    changePage, changeRowsPerPage, closeHistoryModal,
    getListError,
    getListPending,
    getListSuccess,
    reset,
    selectOutcomeMaterialList, setOutcomeTotalInfo
} from "../../../../store/reducers/outcomeMaterialListSlice";
import outcomeService from "../../../../services/outcomeService";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import MaterialRow from "./MaterialRow";
import {IOutcomeTotalInfo} from "../../../../models/IOutcome";
import {FiPrinter} from "react-icons/fi";
import PriceHistoryModal from "./PriceHistoryModal";
import EditPriceModal from "./EditPriceModal";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DetailTableListView = () => {
    const {
        page,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        isOpenHistoryModal,
        isOpenEditPriceModal,
        outcomeTotalInfo,
        updateOutcomeTotalInfo

    } = useAppSelector(selectOutcomeMaterialList)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { outcomeId } = useParams()
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (
            async () => {
                try {
                    dispatch(getListPending())

                    const data:any = await outcomeService.getListOutcomeMaterial(outcomeId || '', page + 1, rowsPerPage)
                    if(!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))
                }catch (error:any) {
                    dispatch(getListError())
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                }
            }
        )()
        return () => {
            cancel = true
        }
    },[enqueueSnackbar, dispatch, page, rowsPerPage, outcomeId])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                let data =  await outcomeService.getOutcomeTotalInfo(outcomeId || '') as IOutcomeTotalInfo

                if (!cancel) dispatch(setOutcomeTotalInfo(data))
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [updateOutcomeTotalInfo, outcomeId, enqueueSnackbar, dispatch])

    return (
        <>
            <Page title={`Накладная ${outcomeId}`} />
            <Root>
                <Container maxWidth="xl">
                    <Header outcomeId={outcomeId} />
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box p={2} mb={2} sx={{backgroundColor: '#5850EC', color: 'white'}}>
                                <Grid container spacing={3} justifyContent={'space-between'} alignItems={'center'}>
                                    <Grid item>
                                        {outcomeTotalInfo && (
                                            <>
                                                <Grid container spacing={1} alignItems='center'>
                                                    <Grid item>
                                                        Склад:
                                                    </Grid>
                                                    <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                        {outcomeTotalInfo.warehouse}
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} alignItems='center'>
                                                    <Grid item>
                                                        От кого:
                                                    </Grid>
                                                    <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                        {outcomeTotalInfo.fromWho}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            color="inherit"
                                        >
                                            <FiPrinter/>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>№</TableCell>
                                                <TableCell>Материал</TableCell>
                                                <TableCell>Марка</TableCell>
                                                <TableCell>Артикул</TableCell>
                                                <TableCell>Коль-во</TableCell>
                                                <TableCell>ЕИ</TableCell>
                                                {!isWarehouseman && (
                                                  <>
                                                      <TableCell>Цена (Расхода)</TableCell>
                                                      <TableCell>Сумма</TableCell>
                                                  </>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length > 0 ? (
                                                <TableBody>
                                                    {rows.map((row) => (
                                                        <MaterialRow key={row.id} row={row}/>
                                                    ))}
                                                </TableBody>
                                            ) : <LoadingTableBody loading={rowsLoading} error={rowsError} />
                                        }
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                        <Grid container justifyContent="space-between">
                            <Grid item sx={{m: 2}}>
                                {!isWarehouseman && outcomeTotalInfo && (
                                    <Typography variant="body1">
                                        Итого Сумма: <b>{outcomeTotalInfo.total}</b>
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item>
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
                            </Grid>
                        </Grid>
                    </Card>
                </Container>
            </Root>
            <PriceHistoryModal open={isOpenHistoryModal} onClose={() => dispatch(closeHistoryModal())} />
            {isOpenEditPriceModal && <EditPriceModal/>}
        </>
    );
};

export default DetailTableListView;
