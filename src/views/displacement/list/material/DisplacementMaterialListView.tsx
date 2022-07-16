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
    changePage, changeRowsPerPage, closeHistoryModal,
    getListError,
    getListPending, getListSuccess,
    reset,
    selectDisplacementMaterialList, setDisplacementTotalInfo
} from "../../../../store/reducers/displacementMaterialSlice";
import errorMessageHandler from "../../../../utils/errorMessageHandler";
import DisplacementService from "../../../../services/DisplacementService";
import {IDisplacementTotalInfo} from "../../../../models/Displacement";
import {FiPrinter} from "react-icons/fi";
import LoadingTableBody from "../../../../components/LoadingTableBody";
import MaterialRow from "./MaterialRow";
import EditPriceModal from "./EditPriceModal";
import PriceHistoryModal from "./PriceHistoryModal";
import ApproveDisplacement from "../ApproveDisplacement";
import hasPermission from "../../../../utils/hasPermisson";
import PERMISSIONS from "../../../../constants/permissions";
import appService from "../../../../services/AppService";

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
        isOpenHistoryModal,
        isOpenEditPriceModal,
        displacementTotalInfo,
        updateDisplacementTotalInfo
    } = useAppSelector(selectDisplacementMaterialList)
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
                                                        rows.map(row =>(
                                                            <MaterialRow
                                                                key={row.id}
                                                                row={row}
                                                                warehouseDestinationId={displacementTotalInfo?.warehouseDestinationId}
                                                                warehouseId={displacementTotalInfo?.warehouseId}
                                                            />
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
            <PriceHistoryModal open={isOpenHistoryModal} onClose={() => dispatch(closeHistoryModal())}/>
            {isOpenEditPriceModal && <EditPriceModal/>}
        </>
    );
};

export default DisplacementMaterialListView;
