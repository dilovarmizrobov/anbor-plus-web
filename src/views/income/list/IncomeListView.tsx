import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import Header from "./Header";
import {
    Box,
    Card, Chip, CircularProgress,
    Container, Grid, InputAdornment, MenuItem,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow, TextField,
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {useSnackbar} from "notistack";
import {setPreviewImageUrl} from "../../../store/reducers/previewImageSlice";
import {
    reset,
    changeStartDate,
    changeEndDate,
    changePage,
    changeRowsPerPage,
    getListError,
    getListPending,
    getListSuccess,
    selectIncomeList, setFilterPriceType, setFilterIncomeType, setFilterIncomeFromWho,
} from "../../../store/reducers/incomeSlice";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import incomeService from "../../../services/IncomeService";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingTableBody from "../../../components/LoadingTableBody";
import EditButtonTable from "../../../components/EditButtonTable";
import CustomDatePicker from "../../../components/CustomDatePicker";
import DetailButtonTable from "../../../components/DetailButtonTable";
import {
    FilterPriceTypeEnum,
    FilterPriceTypeMap,
    IncomeTypeEnum, IncomeTypeMap,
    PATH_OVERHEADS_IMAGE
} from "../../../constants";
import PreviewImageModal from "../../../components/PreviewImageModal";
import {selectPreviewImage} from "../../../store/reducers/previewImageSlice";
import {MdDone} from 'react-icons/md'
import {IDataOption} from "../../../models";
import hasPermission from "../../../utils/hasPermisson";
import PERMISSIONS from "../../../constants/permissions";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const StyledImage = styled('div')(() => ({
    display: 'inline-block',
    marginRight: 10,
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer'
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
        filterPriceType,
        filterIncomeType,
        filterIncomeFromWho
    } = useAppSelector(selectIncomeList)
    const {previewImageUrl} = useAppSelector(selectPreviewImage)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const [providers, setProviders] = useState<IDataOption[]>( [])
    const [providerLoading, setProviderLoading] = useState(false)
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await incomeService.getListIncome(page + 1, rowsPerPage, startDate, endDate, filterPriceType, filterIncomeType, filterIncomeFromWho)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, startDate, endDate, filterPriceType, filterIncomeFromWho])

    const getOptionProviders = async (type: IncomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const providersData = await incomeService.getOptionProviders(type) as IDataOption[]

            setProviders(providersData)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

    return (
        <>
            <Page title="??????????????"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
                                        <Grid item>
                                            <Grid container spacing={3}>
                                                <Grid item>
                                                    <CustomDatePicker changeDate={changeStartDate} label={'????'} />
                                                </Grid>
                                                <Grid item>
                                                    <CustomDatePicker changeDate={changeEndDate} label={'????'} />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={2}>
                                                {Object.keys(FilterPriceTypeEnum).map(priceType => (
                                                    <Grid item key={priceType}>
                                                        {filterPriceType === priceType ? (
                                                            <Chip
                                                                label={FilterPriceTypeMap.get(priceType as FilterPriceTypeEnum)}
                                                                clickable
                                                                color="primary"
                                                                onClick={() => dispatch(setFilterPriceType(priceType as FilterPriceTypeEnum))}
                                                                onDelete={() => dispatch(setFilterPriceType(priceType as FilterPriceTypeEnum))}
                                                                deleteIcon={<MdDone />}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={FilterPriceTypeMap.get(priceType as FilterPriceTypeEnum)}
                                                                clickable
                                                                onClick={() => dispatch(setFilterPriceType(priceType as FilterPriceTypeEnum))}
                                                            />
                                                        )}
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={3} sx={{pt: 2}}>
                                        <Grid item>
                                            <TextField
                                                select
                                                fullWidth
                                                label="???????????????? ??????"
                                                size="small"
                                                onChange={(e) => {
                                                    let value = e.target.value === '' ? undefined : e.target.value as IncomeTypeEnum

                                                    if (value) getOptionProviders(value)
                                                    else setProviders([])

                                                    dispatch(setFilterIncomeType(value))
                                                    dispatch(setFilterIncomeFromWho(undefined))
                                                }}
                                                sx={{width: 250}}
                                                variant="outlined"
                                                value={filterIncomeType || ''}
                                                SelectProps={{
                                                    MenuProps: {
                                                        variant: "selectedMenu",
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                    }
                                                }}
                                            >
                                                <MenuItem value="">??????</MenuItem>
                                                {Object.keys(IncomeTypeEnum).map(item => (
                                                    <MenuItem key={item} value={item}>
                                                        {IncomeTypeMap.get(item as IncomeTypeEnum)}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                select
                                                fullWidth
                                                label="???????????????? ??????????????????/??????????????????????/????????????"
                                                onChange={(e) => dispatch(setFilterIncomeFromWho(e.target.value))}
                                                value={filterIncomeFromWho || ''}
                                                variant="outlined"
                                                size="small"
                                                disabled={providers.length === 0 || providerLoading}
                                                InputProps={providerLoading ? {
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <CircularProgress size={20} />
                                                        </InputAdornment>
                                                    )
                                                } : undefined}
                                                sx={{
                                                    width: 250,
                                                    '& .MuiSelect-icon': {
                                                        visibility: providerLoading ? 'hidden' : 'visible'
                                                    }
                                                }}
                                                SelectProps={{
                                                    MenuProps: {
                                                        variant: "selectedMenu",
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                    }
                                                }}
                                            >
                                                {providers.map(item => (
                                                    <MenuItem key={item.id} value={item.id}>
                                                        {item.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>???</TableCell>
                                                <TableCell>??????????????????</TableCell>
                                                <TableCell>????????</TableCell>
                                                <TableCell>??????????????????</TableCell>
                                                {!isWarehouseman && <TableCell>?????????? ??????????????</TableCell>}
                                                <TableCell>???? ????????</TableCell>
                                                <TableCell>??????????????????????</TableCell>
                                                <TableCell/>
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
                                                                <TableCell>{row.categories.join(", ")}</TableCell>
                                                                {!isWarehouseman && <TableCell>{row.total}</TableCell>}
                                                                <TableCell>{row.fromWho}</TableCell>
                                                                <TableCell>{row.comment}</TableCell>
                                                                <TableCell style={{ maxWidth: 185 }}>{row.imageNames.map(url => (
                                                                    <StyledImage key={url} sx={{backgroundImage: `url(${PATH_OVERHEADS_IMAGE + url})`}} onClick={() => dispatch(setPreviewImageUrl(PATH_OVERHEADS_IMAGE + url))}/>
                                                                ))}</TableCell>
                                                                <TableCell style={{ width: 165 }}>
                                                                    <EditButtonTable
                                                                        to={`/incomes/${row.id}/edit`}
                                                                    />
                                                                    <DetailButtonTable
                                                                        to={`/incomes/${row.id}/materials`}
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
                            labelRowsPerPage={'?????????? ???? ????????????????:'}
                            page={page}
                            onPageChange={(event, newPage) => dispatch(changePage(newPage))}
                            rowsPerPage={rowsPerPage}
                            rowsPerPageOptions={rowsPerPageOptions}
                            onRowsPerPageChange={(event) => dispatch(changeRowsPerPage(parseInt(event.target.value, 10)))}
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} ???? ${count}`}
                        />
                    </Card>
                </Container>
                {previewImageUrl && <PreviewImageModal/>}
            </Root>
        </>
    )
};

export default IncomeListView;
