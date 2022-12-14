import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useSnackbar} from "notistack";
import {
    getListError, getListPending, getListSuccess, reset, selectIncomeMaterialList, changePage,
    changeRowsPerPage, setIncomeTotalInfo, editMaterial,
} from "../../../../store/reducers/incomeMaterialSlice";
import incomeService from "../../../../services/IncomeService";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import {useParams} from "react-router-dom";
import Page from "../../../../components/Page";
import {styled} from "@mui/material/styles";
import {
    Box,
    Card,
    Container, Grid, IconButton,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, Typography
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import {FiPrinter} from "react-icons/fi";
import {IIncomeTotalInfo} from "../../../../models/IIncome";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";
import appService from "../../../../services/AppService";
import {MaterialUnitMap} from "../../../../constants";
import {IResListMaterial} from "../../../../models/Overhead";
import MaterialPriceEdit from "../../../../components/price-edit/MaterialPriceEdit";
import MaterialPriceEditModal from "../../../../components/price-edit/MaterialPriceEditModal";
import {selectMaterialPriceEdit} from "../../../../store/reducers/materialPriceEditSlice";
import PriceHistoryModal from "../../../../components/PriceHistoryModal";
import {openPriceHistory} from "../../../../store/reducers/materialPriceHistorySlice";
import PrintOverheadButton from "../../../../components/PrintOverheadButton";


const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const IncomeMaterialListView = () => {
    const {
        page,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        incomeTotalInfo,
        updateIncomeTotalInfo
    } = useAppSelector(selectIncomeMaterialList)
    const {isOpenMaterialPriceEditModal} = useAppSelector(selectMaterialPriceEdit)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { incomeId } = useParams()
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)
    const [selected, setSelected] = React.useState<number>()

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await appService.getListOverheadMaterial(incomeId || '', page + 1, rowsPerPage)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error: any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, incomeId])

    useEffect(() => {
        let cancel = false;

        (async () => {
           try {
               let data = await incomeService.getIncomeTotalInfo(incomeId || '') as IIncomeTotalInfo

               if (!cancel) dispatch(setIncomeTotalInfo(data))
           } catch (error: any) {
               enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
           }
        })()

        return () => {
            cancel = true
        }
    }, [updateIncomeTotalInfo])

    return (
        <>
            <Page title={`?????????????????? ${incomeId}`}/>
            <Root>
                <Container maxWidth="xl">
                    <Header incomeId={incomeId}/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750}>
                                <Box p={2} mb={2} sx={{backgroundColor: '#5850EC', color: 'white'}}>
                                    <Grid container spacing={3} justifyContent={'space-between'} alignItems={'center'}>
                                        <Grid item>
                                            {incomeTotalInfo && (
                                                <>
                                                    <Grid container spacing={1} alignItems='center'>
                                                      <Grid item>
                                                          ??????????:
                                                      </Grid>
                                                      <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                          {incomeTotalInfo.warehouse}
                                                      </Grid>
                                                    </Grid>
                                                    <Grid container spacing={1} alignItems='center'>
                                                      <Grid item>
                                                          ???? ????????:
                                                      </Grid>
                                                      <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                          {incomeTotalInfo.fromWho}
                                                      </Grid>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                        <Grid item>
                                            <PrintOverheadButton overheadId={incomeId}/>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>???</TableCell>
                                                <TableCell>????????????????</TableCell>
                                                <TableCell>??????????</TableCell>
                                                <TableCell>??????????????</TableCell>
                                                <TableCell>????????-????</TableCell>
                                                <TableCell>????</TableCell>
                                                {!isWarehouseman && (
                                                    <>
                                                        <TableCell>???????? (??????????????)</TableCell>
                                                        <TableCell>??????????</TableCell>
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
                                {!isWarehouseman && incomeTotalInfo && (
                                    <Typography variant="body1">
                                        ?????????? ??????????: <b>{incomeTotalInfo.total}</b>
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item>
                                <TablePagination
                                    component="div"
                                    count={rowsCount}
                                    labelRowsPerPage={'?????????? ???? ????????????????:'}
                                    page={page}
                                    onPageChange={(event, newPage) => dispatch(changePage(newPage))}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    onRowsPerPageChange={(event) => dispatch(changeRowsPerPage(parseInt(event.target.value, 10)))}
                                    labelDisplayedRows={({from, to, count}) => `${from}-${to} ???? ${count}`}
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

export default IncomeMaterialListView;
