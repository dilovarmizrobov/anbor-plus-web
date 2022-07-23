import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import {useAppDispatch, useAppSelector} from "../../../../store/hooks";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import Page from "../../../../components/Page";
import {
    Box,
    Card,
    Container,
    Grid,
    IconButton,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, Typography
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
    changePage, changeRowsPerPage,
    getListError,
    getListPending, getListSuccess,
    reset,editMaterial,
    selectDisplacementMaterialList, setDisplacementTotalInfo
} from "../../../../store/reducers/displacementMaterialSlice";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import DisplacementService from "../../../../services/DisplacementService";
import {IDisplacementTotalInfo} from "../../../../models/Displacement";
import {FiPrinter} from "react-icons/fi";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import ApproveDisplacement from "../ApproveDisplacement";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";
import appService from "../../../../services/AppService";
import {openPriceHistory} from "../../../../store/reducers/materialPriceHistorySlice";
import {MaterialUnitMap} from "../../../../constants";
import {selectAuth} from "../../../../store/reducers/authSlice";
import {IResListMaterial} from "../../../../models/Overhead";
import MaterialPriceEdit from "../../../../components/price-edit/MaterialPriceEdit";
import MaterialPriceEditModal from "../../../../components/price-edit/MaterialPriceEditModal";
import {selectMaterialPriceEdit} from "../../../../store/reducers/materialPriceEditSlice";
import PriceHistoryModal from "../../../../components/PriceHistoryModal";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const DisplacementMaterialListView = () => {
    const {
        page,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        displacementTotalInfo,
        updateDisplacementTotalInfo
    } = useAppSelector(selectDisplacementMaterialList)
    const {user} = useAppSelector(selectAuth)
    const {isOpenMaterialPriceEditModal} = useAppSelector(selectMaterialPriceEdit)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const { displacementId } = useParams()
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await appService.getListOverheadMaterial(displacementId || '', page + 1, rowsPerPage)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, displacementId])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                let data =  await DisplacementService.getDisplacementTotalInfo(displacementId || '') as IDisplacementTotalInfo

                if (!cancel) dispatch(setDisplacementTotalInfo(data))
            } catch (error: any) {
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [updateDisplacementTotalInfo, dispatch, enqueueSnackbar, displacementId])

    return (
        <>
            <Page title={`Накладная ${displacementId}`}/>
            <Root>
                <Container maxWidth="xl">
                    <Header displacementId={displacementId}/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750}>
                                <Box p={2} mb={2} sx={{backgroundColor: '#5850EC', color: 'white'}}>
                                    <Grid container spacing={3} justifyContent={'space-between'} alignItems={'center'}>
                                        <Grid item>
                                            {displacementTotalInfo && (
                                                <>
                                                    <Grid container spacing={1} alignItems='center'>
                                                        <Grid item>
                                                            Отправитель:
                                                        </Grid>
                                                        <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                            {displacementTotalInfo.warehouse}
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={1} alignItems='center'>
                                                        <Grid item>
                                                            Получатель:
                                                        </Grid>
                                                        <Grid item sx={{fontSize: 18, fontWeight: 500}}>
                                                            {displacementTotalInfo.destination}
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
                                {displacementTotalInfo && (
                                    <ApproveDisplacement warehouseDestinationId={displacementTotalInfo.warehouseDestinationId}/>
                                )}
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>№</TableCell>
                                                <TableCell>Материал</TableCell>
                                                <TableCell>Марка</TableCell>
                                                <TableCell>Артикуль</TableCell>
                                                <TableCell>Коль-во</TableCell>
                                                <TableCell>ЕИ</TableCell>
                                                {!isWarehouseman && (
                                                    <>
                                                        <TableCell>Цена</TableCell>
                                                        <TableCell>Сумма</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length > 0 ? (
                                                <TableBody>
                                                    {
                                                        rows.map(row => (
                                                            <TableRow key={row.id} hover onClick={() => !isWarehouseman && row.price && dispatch(openPriceHistory(row.priceHistory))}>
                                                                <TableCell>{row.id}</TableCell>
                                                                <TableCell>{row.material}</TableCell>
                                                                <TableCell>{row.mark}</TableCell>
                                                                <TableCell>{row.sku}</TableCell>
                                                                <TableCell>{row.qty}</TableCell>
                                                                <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                                                                {!isWarehouseman && (displacementTotalInfo?.warehouseDestinationId === user!.warehouse.id) && (
                                                                    <>
                                                                        <TableCell>{row.price || '-'}</TableCell>
                                                                        <TableCell>{row.total || '-'}</TableCell>
                                                                    </>
                                                                )}
                                                                {!isWarehouseman && (displacementTotalInfo?.warehouseId === user!.warehouse.id) && (
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
                                                        ))
                                                    }
                                                </TableBody>
                                            ) : <LoadingTableBody loading={rowsLoading} error={rowsError}/>
                                        }
                                    </Table>
                                </TableContainer>
                            </Box>
                        </PerfectScrollbar>
                        <Grid container justifyContent="space-between">
                            <Grid item sx={{m: 2}}>
                                { displacementTotalInfo && (
                                    <Typography variant="body1">
                                        Итого Сумма: <b>{displacementTotalInfo.total}</b>
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

export default DisplacementMaterialListView;
