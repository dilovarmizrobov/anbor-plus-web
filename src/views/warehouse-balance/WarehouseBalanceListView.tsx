import React, {useEffect, useState} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../components/Page";
import {
    Box,
    Card,
    Container, Grid,
    InputAdornment, MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {changeQuery, selectWarehouseBalance, setFilterCategoryId} from '../../store/reducers/warehouseBalanceSlice';
import {useSnackbar} from 'notistack';
import useDebounce from '../../hooks/useDebounce';
import PerfectScrollbar from "react-perfect-scrollbar";
import {
    reset, getListPending, getListSuccess, getListError, changePage, changeRowsPerPage
} from '../../store/reducers/warehouseBalanceSlice';
import appService from '../../services/AppService';
import errorMessageHandler from '../../utils/errorMessageHandler';
import {FiSearch} from 'react-icons/fi';
import LoadingTableBody from "../../components/LoadingTableBody";
import MaterialRow from "./MaterialRow";
import {IDataOption} from "../../models";
import {useNavigate} from "react-router-dom";
import LoadingLayout from "../../components/LoadingLayout";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const List: React.FC<{categories: IDataOption[]}> = ({categories}) => {
    const {
        filterCategoryId,
        query,
        page,
        rowsPerPage,
        rowsCount,
        rowsPerPageOptions,
        rows,
        rowsLoading,
        rowsError
    } = useAppSelector(selectWarehouseBalance)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => () => {
        dispatch(reset())
    }, [dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await appService.getListWarehouseBalance(page + 1, rowsPerPage, debouncedQuery, filterCategoryId)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error: any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, debouncedQuery, filterCategoryId])

    return (
        <>
            <Root>
                <Container maxWidth="xl">
                    <Typography variant="h5" color="textPrimary">
                        Остаток
                    </Typography>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <Grid container spacing={3} justifyContent="space-between">
                                        <Grid item>
                                            <TextField
                                                sx={{width: 300}}
                                                size="small"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <FiSearch/>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                onChange={(event) => dispatch(changeQuery(event.target.value))}
                                                placeholder="Поиск"
                                                value={query}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Выберите категорию"
                                                size="small"
                                                onChange={(e) => {
                                                    let value = e.target.value === '' ? undefined : Number(e.target.value)

                                                    dispatch(setFilterCategoryId(value))
                                                }}
                                                sx={{width: 300}}
                                                variant="outlined"
                                                value={filterCategoryId || ''}
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
                                                {categories.map(item => (
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
                                                <TableCell/>
                                                <TableCell/>
                                                <TableCell>Материал</TableCell>
                                                <TableCell>Коль-во</TableCell>
                                                <TableCell>Единица измерения</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {rows.length > 0 ? (
                                            <TableBody>
                                                {rows.map(row => <MaterialRow key={row.id} row={row}/>)}
                                            </TableBody>
                                        ) : <LoadingTableBody loading={rowsLoading} error={rowsError}/>}
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
    );
}

const WarehouseBalanceListView = () => {
    const {enqueueSnackbar} = useSnackbar()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [categories, setCategories] = useState<IDataOption[]>([])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                const dataCategories: any = await appService.getOptionCategories()

                if (dataCategories.length === 0) {
                    navigate(-1)
                    enqueueSnackbar('Добавьте с начала категорию', {variant: 'info'})
                } else if (!cancel) setCategories(dataCategories)
            } catch (error: any) {
                !cancel && setError(true)
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            } finally {
                !cancel && setLoading(false)
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, navigate])

    return (
        <>
            <Page title="Остаток"/>
            {!loading && !error && categories.length > 0 ? <List categories={categories}/>
            : <LoadingLayout loading={loading} error={error} />}
        </>
    )
};

export default WarehouseBalanceListView;