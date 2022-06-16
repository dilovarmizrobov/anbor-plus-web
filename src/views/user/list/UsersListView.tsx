import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container, IconButton,
    InputAdornment,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TablePagination, TableRow,
    TextField
} from "@mui/material";
import {FiEdit, FiSearch} from "react-icons/fi";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink as RouterLink} from "react-router-dom";
import {
    changePage,
    changeQuery,
    changeRowsPerPage, deleteRow,
    getListUsersError, getListUsersPending, getListUsersSuccess,
    reset,
    selectUserList
} from "../../../store/reducers/userSlice";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import useDebounce from "../../../hooks/useDebounce";
import userService from "../../../services/userService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import {useSnackbar} from "notistack";
import LoadingTableBody from "../../../components/LoadingTableBody";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import {UserRolesMap} from "../../../constants";


const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const UsersListView = () => {
    const {page, rowsPerPage, query, rowsLoading, rowsError, rows, rowsCount, rowsPerPageOptions,
        rowsUpdate} = useAppSelector(selectUserList)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => () => {dispatch(reset())}, [dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListUsersPending())

                const data: any = await userService.getListUsers(page + 1, rowsPerPage, debouncedQuery)

                if (!cancel) dispatch(getListUsersSuccess({rows: data.content, rowsCount: data.totalElements}))
            } catch (error: any) {
                dispatch(getListUsersError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {cancel = true}
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, debouncedQuery, rowsUpdate])

    return (
        <>
            <Page title="Пользователи"/>
            <Root>
                <Container maxWidth="xl">
                    <Header />
                    <Card sx={{mt: 3}}>
                        <PerfectScrollbar>
                            <Box minWidth={750}>
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
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ФИО</TableCell>
                                            <TableCell>Должность</TableCell>
                                            <TableCell>Склад</TableCell>
                                            <TableCell>Логин</TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                    {rows.length > 0 ? (
                                        <TableBody>
                                            {rows.map(row => (
                                                <TableRow hover key={row.id}>
                                                    <TableCell>{row.fullName}</TableCell>
                                                    <TableCell>{UserRolesMap.get(row.role)}</TableCell>
                                                    <TableCell>row.warehouse</TableCell>
                                                    <TableCell>{row.phoneNumber}</TableCell>
                                                    <TableCell>
                                                        <IconButton
                                                            size="large"
                                                            component={RouterLink}
                                                            to={`/users/${row.id}/edit`}
                                                        >
                                                            <FiEdit size={20} />
                                                        </IconButton>
                                                        <DeleteButtonTable
                                                            rowId={row.id}
                                                            onDelete={userService.deleteUser}
                                                            handleDelete={(rowId: number) => dispatch(deleteRow(rowId))}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    ) : <LoadingTableBody loading={rowsLoading} error={rowsError}/>}
                                </Table>
                            </TableContainer>
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

export default UsersListView;