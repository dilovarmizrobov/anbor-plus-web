import React, {useEffect} from 'react';
import Page from "../../../components/Page";
import {styled} from "@mui/material/styles";
import {
    Box,
    Card,
    Container,
    InputAdornment,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    TextField
} from "@mui/material";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiSearch} from "react-icons/fi";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {
    changePage, changeQuery, changeRowsPerPage, deleteRow, getListError,
    getListPending,
    getListSuccess,
    reset,
    selectMaterial
} from "../../../store/reducers/materialSlice";
import {useSnackbar} from "notistack";
import useDebounce from "../../../hooks/useDebounce";
import materialService from "../../../services/MaterialService";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import LoadingTableBody from "../../../components/LoadingTableBody";
import EditButtonTable from "../../../components/EditButtonTable";
import DeleteButtonTable from "../../../components/DeleteButtonTable";
import {MaterialUnitMap} from "../../../constants";

const Root = styled('div')(({theme}) => ({
    minHeight: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
}))

const MaterialListView = () => {
    const {
        page,
        query,
        rowsPerPage,
        rowsLoading,
        rowsError,
        rows,
        rowsCount,
        rowsPerPageOptions,
    } = useAppSelector(selectMaterial)

    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const debouncedQuery = useDebounce(query, 500)

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())
                const data: any = await materialService.getListMaterial(page + 1, rowsPerPage, debouncedQuery)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))

            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [enqueueSnackbar, dispatch, page, rowsPerPage, debouncedQuery])

    return (
        <>
            <Page title="Предприятия"/>
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
                                                <TableCell>Наименование</TableCell>
                                                <TableCell>Марка</TableCell>
                                                <TableCell>Единица измерения</TableCell>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        {
                                            rows.length > 0 ? (
                                                <TableBody>
                                                    {
                                                        rows.map((row) =>(
                                                            <TableRow hover key={row.id}>
                                                                <TableCell>{row.name}</TableCell>
                                                                <TableCell>{row.marks.map(mark => mark.name).join(', ')}</TableCell>
                                                                <TableCell>{MaterialUnitMap.get(row.unit)}</TableCell>
                                                                <TableCell style={{ width: 165 }}>
                                                                    <EditButtonTable
                                                                        to={`/materials/${row.id}/edit`}
                                                                    />
                                                                    <DeleteButtonTable
                                                                        rowId={row.id!}
                                                                        onDelete={materialService.deleteMaterial}
                                                                        handleDelete={(rowId: number) => dispatch(deleteRow(rowId))}
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
            </Root>
        </>
    );
};

export default MaterialListView;
