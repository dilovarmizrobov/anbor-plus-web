import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {useParams} from "react-router-dom";
import {operationMaterialListActions, selectOperationMaterialList} from "../../../../store/reducers/operationSlice";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useSnackbar} from "notistack";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import operationService from "../../../../services/operationService";
import {IResListMaterial, IResTotalInfo} from "../../../../models/Operation";
import Page from "../../../../components/Page";
import LoadingLayout from "../../../../components/LoadingLayout";
import {
    Box,
    Card,
    Container,
    Grid,
    Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import {MaterialUnitMap, OperationTypeEnum, OperationTypeMap} from "../../../../constants";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import PriceHistoryModal from "../../../../components/PriceHistoryModal";
import {openPriceHistory} from "../../../../store/reducers/materialPriceHistorySlice";
import MaterialPriceEdit from "../../../../components/price-edit/MaterialPriceEdit";
import MaterialPriceEditModal from "../../../../components/price-edit/MaterialPriceEditModal";
import {selectMaterialPriceEdit} from "../../../../store/reducers/materialPriceEditSlice";
import ApproveOperation from "./ApproveOperation";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const OperationMaterialListView = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { operationId } = useParams()
    const {totalInfo, updateTotalInfo} = useAppSelector(selectOperationMaterialList)
    const {reset, setTotalInfo} = operationMaterialListActions
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch, reset])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const data = await operationService.getTotalInfo(operationId || '') as IResTotalInfo

                if (!cancel) dispatch(setTotalInfo(data))
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [dispatch, enqueueSnackbar, operationId, updateTotalInfo])

    return !loading && !error && totalInfo ? <Content/>
        : <LoadingLayout loading={loading} error={error} />
};

const Content = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { operationId } = useParams()
    const {totalInfo, rowsCount, page, rowsPerPage, rowsPerPageOptions, rows, rowsLoading, rowsError} = useAppSelector(selectOperationMaterialList)
    const {changePage, changeRowsPerPage, getListPending, getListSuccess, getListError,
        editMaterial} = operationMaterialListActions
    const title = OperationTypeMap.get(totalInfo!.type as OperationTypeEnum) + ` ` + operationId
    const {isOpenMaterialPriceEditModal} = useAppSelector(selectMaterialPriceEdit)
    const isAdmin = hasPermission(PERMISSIONS.ADMIN)

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await operationService.getListMaterial(operationId || '', page + 1, rowsPerPage)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error: any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, operationId])

    return (
        <>
            <Page title={title}/>
            <Root>
                <Container maxWidth="xl">
                    <Header title={title}/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750}>
                                {isAdmin && (
                                    <Box p={2}>
                                        <Grid container spacing={3} justifyContent='right'>
                                            <Grid item>
                                                <ApproveOperation/>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>№</TableCell>
                                                <TableCell>Материал</TableCell>
                                                <TableCell>Марка</TableCell>
                                                <TableCell>Артикул</TableCell>
                                                <TableCell>Остаток</TableCell>
                                                <TableCell>ЕИ</TableCell>
                                                <TableCell>Коль-во</TableCell>
                                                <TableCell>Цена</TableCell>
                                                <TableCell>Сумма</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map(row => (
                                                    <TableRow hover key={row.id} onClick={() => row.price && dispatch(openPriceHistory(row.priceHistory))}>
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.material}</TableCell>
                                                        <TableCell>{row.mark}</TableCell>
                                                        <TableCell>{row.sku}</TableCell>
                                                        <TableCell>{row.balance}</TableCell>
                                                        <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                                                        <TableCell>{row.qty}</TableCell>
                                                        <TableCell style={{ width: 140 }}>
                                                            {totalInfo!.approved ? row.price : (
                                                                <MaterialPriceEdit
                                                                    materialId={row.id}
                                                                    price={row.price}
                                                                    priceHistoryLength={row.priceHistory.length}
                                                                    onEditPrice={operationService.putMaterialPriceEdit}
                                                                    handleEditPrice={(material: any) => dispatch(editMaterial(material as IResListMaterial))}
                                                                />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{row.total || '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        ) : <LoadingTableBody loading={rowsLoading} error={rowsError} />}
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                        <Grid container justifyContent="space-between">
                            <Grid item sx={{m: 2}}>
                                <Typography variant="body1">
                                    Итого Сумма: <b>{totalInfo!.total}</b>
                                </Typography>
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
            <PriceHistoryModal/>
            {isOpenMaterialPriceEditModal &&
                <MaterialPriceEditModal
                    onEditPrice={operationService.putMaterialPriceEdit}
                    handleEditPrice={(material: any) => dispatch(editMaterial(material as IResListMaterial))}
                />
            }
        </>
    )
}

export default OperationMaterialListView;