import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import {
    Box,
    Card, Chip, CircularProgress,
    Container, Grid, InputAdornment, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TextField
} from "@mui/material";
import Page from "../../../components/Page";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    getListPending,
    reset,
    selectOutcomeList,
    getListError,
    getListSuccess,
    changeEndDate,
    changeStartDate,
    changePage,
    changeRowsPerPage,
    setFilterPriceType,
    setFilterOutcomeType,
    setFilterOutcomeFromWho
} from "../../../store/reducers/outcomeSlice";
import {useSnackbar} from "notistack";
import outcomeService from "../../../services/outcomeService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import CustomDatePicker from "../../../components/CustomDatePicker";
import LoadingTableBody from "../../../components/LoadingTableBody";
import {
    FilterPriceTypeEnum,
    FilterPriceTypeMap,
    OutcomeTypeEnum, OutcomeTypeMap,
    PATH_OVERHEADS_IMAGE
} from "../../../constants";
import EditButtonTable from "../../../components/EditButtonTable";
import DetailButtonTable from "../../../components/DetailButtonTable";
import {selectPreviewImage, setPreviewImageUrl} from "../../../store/reducers/previewImageSlice";
import PreviewImageModal from "../../../components/PreviewImageModal";
import {MdDone} from "react-icons/md";
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

const OutcomeListView = () => {
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
        filterOutcomeFromWho,
        filterOutcomeType
    } = useAppSelector(selectOutcomeList)
    const {previewImageUrl} = useAppSelector(selectPreviewImage)
    const [providers, setProviders] = useState<IDataOption[]>( [])
    const [providerLoading, setProviderLoading] = useState(false)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await outcomeService.getOutcomeList(page + 1, rowsPerPage, startDate, endDate,filterPriceType, filterOutcomeType, filterOutcomeFromWho)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, startDate, endDate, filterPriceType, filterOutcomeFromWho])

    const getOptionOutcomeType = async(type: OutcomeTypeEnum) => {
        try {
            setProviderLoading(true)
            const data: any = await outcomeService.getOptionOutcomeType(type) as IDataOption[]

            setProviders(data)
        } catch (error : any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

    return (
        <>
            <Page title="Расходы"/>
            <Root>
                <Container maxWidth="xl">
                    <Header />
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <Grid container spacing={3} alignItems="center" justifyContent="space-between">
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
                                                label="Выберите тип"
                                                size="small"
                                                onChange={e => {
                                                    let value = e.target.value === '' ? undefined : e.target.value as OutcomeTypeEnum

                                                    if(value) getOptionOutcomeType(value)
                                                    else setProviders([])

                                                    dispatch(setFilterOutcomeType(value))
                                                    dispatch(setFilterOutcomeFromWho(undefined))
                                                }}
                                                variant="outlined"
                                                sx={{width: 250}}
                                                value={filterOutcomeType || ''}
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
                                                <MenuItem value="">Все</MenuItem>
                                                {
                                                    Object.keys(OutcomeTypeEnum).map(item => (
                                                        <MenuItem key={item} value={item}>
                                                            {OutcomeTypeMap.get(item as OutcomeTypeEnum)}
                                                        </MenuItem>
                                                    ))
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Выберите Предприятие/Объект"
                                                onChange={(e) => dispatch(setFilterOutcomeFromWho(e.target.value))}
                                                value={filterOutcomeFromWho || ''}
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
                                                <TableCell>№</TableCell>
                                                <TableCell>Накладная</TableCell>
                                                <TableCell>Дата</TableCell>
                                                <TableCell>Категория</TableCell>
                                                {!isWarehouseman && <TableCell>Сумма Расхода</TableCell>}
                                                <TableCell>От кого</TableCell>
                                                <TableCell>Комментарий</TableCell>
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
                                                                <TableCell>{row.categories.join(', ')}</TableCell>
                                                                {!isWarehouseman && <TableCell>{row.total}</TableCell>}
                                                                <TableCell>{row.fromWho}</TableCell>
                                                                <TableCell>{row.comment}</TableCell>
                                                                <TableCell style={{ maxWidth: 185 }}>{row.imageNames.map(url => (
                                                                    <StyledImage key={url} sx={{backgroundImage: `url(${PATH_OVERHEADS_IMAGE + url})`}} onClick={() => dispatch(setPreviewImageUrl(PATH_OVERHEADS_IMAGE + url))}/>
                                                                ))}</TableCell>
                                                                <TableCell style={{ width: 120 }}>
                                                                    <EditButtonTable to={`/outcomes/${row.id}/edit`} />
                                                                    <DetailButtonTable to={`/outcomes/${row.id}/materials`}/>
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
                {previewImageUrl && <PreviewImageModal/>}
            </Root>
        </>
    );
};

export default OutcomeListView;
