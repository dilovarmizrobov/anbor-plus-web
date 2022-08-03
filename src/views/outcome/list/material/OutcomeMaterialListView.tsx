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
    changePage, changeRowsPerPage, editMaterial,
    getListError,
    getListPending,
    getListSuccess,
    reset,
    selectOutcomeMaterialList, setOutcomeTotalInfo
} from "../../../../store/reducers/outcomeMaterialListSlice";
import outcomeService from "../../../../services/outcomeService";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import {IOutcomeTotalInfo} from "../../../../models/IOutcome";
import {FiPrinter} from "react-icons/fi";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";
import appService from "../../../../services/AppService";
import PriceHistoryModal from "../../../../components/PriceHistoryModal";
import {openPriceHistory} from "../../../../store/reducers/materialPriceHistorySlice";
import {MaterialUnitMap} from "../../../../constants";
import {IResListMaterial} from "../../../../models/Overhead";
import MaterialPriceEdit from "../../../../components/price-edit/MaterialPriceEdit";
import MaterialPriceEditModal from "../../../../components/price-edit/MaterialPriceEditModal";
import {selectMaterialPriceEdit} from "../../../../store/reducers/materialPriceEditSlice";
import PrintOverheadButton from "../../../../components/PrintOverheadButton";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const OutcomeMaterialListView = () => {
    const {
        page,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        outcomeTotalInfo,
        updateOutcomeTotalInfo
    } = useAppSelector(selectOutcomeMaterialList)
    const {isOpenMaterialPriceEditModal} = useAppSelector(selectMaterialPriceEdit)
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

                    const data:any = await appService.getListOverheadMaterial(outcomeId || '', page + 1, rowsPerPage)
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
                                        <PrintOverheadButton overheadId={outcomeId}/>
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
                                                      <TableCell>Средняя цена</TableCell>
                                                      <TableCell>Цена (Расхода)</TableCell>
                                                      <TableCell>Сумма</TableCell>
                                                  </>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length > 0 ? (
                                                <TableBody>
                                                    {rows.map(row => (
                                                        <TableRow key={row.id} hover onClick={() => !isWarehouseman && row.price && dispatch(openPriceHistory(row.priceHistory))}>
                                                            <TableCell>{row.id}</TableCell>
                                                            <TableCell>{row.material}</TableCell>
                                                            <TableCell>{row.mark}</TableCell>
                                                            <TableCell>{row.sku}</TableCell>
                                                            <TableCell>{row.qty}</TableCell>
                                                            <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                                                            {!isWarehouseman && (
                                                                <>
                                                                    <TableCell>{row.offerPrice}</TableCell>
                                                                    <TableCell style={{ width: 140 }}>
                                                                        <MaterialPriceEdit
                                                                            materialId={row.id}
                                                                            price={row.price}
                                                                            priceHistoryLength={row.priceHistory.length}
                                                                            onEditPrice={appService.putMaterialPriceEdit}
                                                                            handleEditPrice={(material: any) => dispatch(editMaterial(material as IResListMaterial))}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell>{row.total || '-'}</TableCell>
                                                                </>
                                                            )}
                                                        </TableRow>
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
            <PriceHistoryModal/>
            {isOpenMaterialPriceEditModal &&
                <MaterialPriceEditModal
                    onEditPrice={appService.putMaterialPriceEdit}
                    handleEditPrice={(material: any) => dispatch(editMaterial(material as IResListMaterial))}
                />
            }
        </>
    );
};

export default OutcomeMaterialListView;
