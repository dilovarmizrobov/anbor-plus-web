import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiEdit, FiSearch} from "react-icons/fi";
import {NavLink as RouterLink} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    changePage,
    changeQuery,
    changeRowsPerPage,
    deleteRow,
    getListObjectError,
    getListObjectPending,
    getListObjectSuccess,
    reset,
    selectObject
} from "../../../store/reducers/objectSlice";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import objectService from "../../../services/objectService";
import LoadingTableBody from "../../../components/LoadingTableBody";
import DeleteButtonTable from "../../../components/DeleteButtonTable";


const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const ObjectListView = () => {
    const {
        page,
        query,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
        rowsUpdate
    } = useAppSelector(selectObject)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => () => {
        dispatch(reset())
    }, [dispatch])

    useEffect(() => {
        let cancel = false;

        (
            async () => {
                try {
                    dispatch(getListObjectPending())

                    const data: any = await objectService.getListObject(page + 1, rowsPerPage, debouncedQuery)

                    if (!cancel) dispatch(getListObjectSuccess({rows: data.content, rowsCount: data.totalElements}))

                } catch (error: any) {
                    dispatch(getListObjectError())
                    enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
                }
            }
        )()
        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, debouncedQuery, rowsUpdate])

    return (
        <>
            <Page title="Обьекты"/>
            <Root>
                <Container maxWidth="xl">
                    <Header/>
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750} sx={{mb: 2}}>
                                <Box mx={2} my={3}>
                                    <TextField
                                        sx={{width: 400}}
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
                                </Box>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Название</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length ? (
                                                <TableBody>
                                                    {
                                                        rows.map((row) => (
                                                            <TableRow hover key={row.id}>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell style={{width: 165}}>
                                                                    <IconButton
                                                                        size="large"
                                                                        component={RouterLink}
                                                                        to={`/objects/${row.id}/edit`}
                                                                    >
                                                                        <FiEdit size={20}/>
                                                                    </IconButton>
                                                                    <DeleteButtonTable
                                                                        rowId={row.id!}
                                                                        onDelete={objectService.deleteObject}
                                                                        handleDelete={(rowId: number) => dispatch(deleteRow(rowId))}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    }
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
};

export default ObjectListView;
