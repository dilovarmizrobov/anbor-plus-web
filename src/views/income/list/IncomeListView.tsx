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
    IncomeFilterPriceTypeEnum,
    IncomeFilterPriceTypeMap,
    IncomeTypeEnum, IncomeTypeMap,
    PATH_OVERHEADS_IMAGE
} from "../../../constants";
import PreviewImageModal from "./PreviewImageModal";
import {selectPreviewImage} from "../../../store/reducers/previewImageSlice";
import {MdDone} from 'react-icons/md'
import {IIncomeOption} from "../../../models/IIncome";

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
    const [providers, setProviders] = useState<IIncomeOption[]>( [])
    const [providerLoading, setProviderLoading] = useState(false)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await incomeService.getListIncome(page + 1, rowsPerPage, startDate, endDate, filterPriceType, filterIncomeFromWho)

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
            const providersData = await incomeService.getOptionProviders(type) as IIncomeOption[]

            setProviders(providersData)
            // formik.setFieldValue('fromWhoId', 0)
        } catch (error: any) {
            enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
        } finally {
            setProviderLoading(false)
        }
    }

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
                                                {Object.keys(IncomeFilterPriceTypeEnum).map(priceType => (
                                                    <Grid item key={priceType}>
                                                        {filterPriceType === priceType ? (
                                                            <Chip
                                                                label={IncomeFilterPriceTypeMap.get(priceType as IncomeFilterPriceTypeEnum)}
                                                                clickable
                                                                color="primary"
                                                                onClick={() => dispatch(setFilterPriceType(priceType as IncomeFilterPriceTypeEnum))}
                                                                onDelete={() => dispatch(setFilterPriceType(priceType as IncomeFilterPriceTypeEnum))}
                                                                deleteIcon={<MdDone />}
                                                            />
                                                        ) : (
                                                            <Chip
                                                                label={IncomeFilterPriceTypeMap.get(priceType as IncomeFilterPriceTypeEnum)}
                                                                clickable
                                                                onClick={() => dispatch(setFilterPriceType(priceType as IncomeFilterPriceTypeEnum))}
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
                                                onChange={(e) => {
                                                    let value = e.target.value === '' ? undefined : e.target.value as IncomeTypeEnum
                                                    dispatch(setFilterIncomeType(value))

                                                    if (value) getOptionProviders(value)
                                                    else {
                                                        dispatch(setFilterIncomeFromWho(undefined))
                                                        setProviders([])
                                                    }
                                                }}
                                                sx={{width: 259}}
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
                                                <MenuItem value="">Все</MenuItem>
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
                                                label="Выберите Снабженца/Предприятие/Объект"
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
                                                    width: 259,
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
                                                    <MenuItem key={item.id} value={item.name}>
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
                                                <TableCell>Дата</TableCell>
                                                <TableCell>Категория</TableCell>
                                                <TableCell>Сумма прихода</TableCell>
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
                                                                <TableCell>{row.createdDate}</TableCell>
                                                                <TableCell>{row.categories.join(", ")}</TableCell>
                                                                <TableCell>{row.total}</TableCell>
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
    )
};

export default IncomeListView;