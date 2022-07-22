import React, {useEffect} from 'react';
import {styled} from "@mui/material/styles";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {selectOperationList, reset, changePage, changeRowsPerPage,
    changeQuery, getListPending, getListSuccess, getListError} from "../../../store/reducers/operationSlice";
import {selectPreviewImage, setPreviewImageUrl} from "../../../store/reducers/previewImageSlice";
import {useSnackbar} from "notistack";
import Page from "../../../components/Page";
import {
    Box,
    Card,
    Container,
    InputAdornment, Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TextField, Typography
} from "@mui/material";
import PreviewImageModal from "../../../components/PreviewImageModal";
import Header from "./Header";
import PerfectScrollbar from "react-perfect-scrollbar";
import {FiSearch} from "react-icons/fi";
import {OperationTypeMap, PATH_OVERHEADS_IMAGE} from "../../../constants";
import EditButtonTable from "../../../components/EditButtonTable";
import DetailButtonTable from "../../../components/DetailButtonTable";
import LoadingTableBody from "../../../components/LoadingTableBody";
import errorMessageHandler from "../../../utils/errorMessageHandler";
import operationService from "../../../services/operationService";

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

const OperationListView = () => {
    const {rows, rowsLoading, rowsError, rowsCount, page, query, rowsPerPage, rowsPerPageOptions} = useAppSelector(selectOperationList)
    const {previewImageUrl} = useAppSelector(selectPreviewImage)
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()

    useEffect(() => () => {
        dispatch(reset())
    },[dispatch])

    useEffect(() => {
        let cancel = false;

        (async () => {
            try {
                dispatch(getListPending())

                const data: any = await operationService.getListOperation(page + 1, rowsPerPage, query)

                if (!cancel) dispatch(getListSuccess({rows: data.content, rowsCount: data.totalElements}))
            } catch (error:any) {
                dispatch(getListError())
                enqueueSnackbar(errorMessageHandler(error), {variant: 'error'})
            }
        })()

        return () => {
            cancel = true
        }
    }, [dispatch, enqueueSnackbar, page, query, rowsPerPage])

    return (
        <>
            <Page title="Операции"/>
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
                                                <TableCell>№</TableCell>
                                                <TableCell>Дата</TableCell>
                                                <TableCell>Акт</TableCell>
                                                <TableCell>Категория</TableCell>
                                                <TableCell>Тип операции</TableCell>
                                                <TableCell>Склад</TableCell>
                                                <TableCell>Ответственный</TableCell>
                                                <TableCell>Статус</TableCell>
                                                <TableCell/>
                                                <TableCell/>
                                            </TableRow>
                                        </TableHead>
                                        {rows.length > 0 ? (
                                            <TableBody>
                                                {
                                                    rows.map(row => (
                                                        <TableRow hover key={row.id}>
                                                            <TableCell>{row.id}</TableCell>
                                                            <TableCell>{row.createdDate}</TableCell>
                                                            <TableCell>{row.act}</TableCell>
                                                            <TableCell>{row.categories.join(", ")}</TableCell>
                                                            <TableCell>{OperationTypeMap.get(row.type)}</TableCell>
                                                            <TableCell>{row.warehouse}</TableCell>
                                                            <TableCell>{row.createdBy}</TableCell>
                                                            <TableCell>
                                                                {row.approved ? (
                                                                    <Typography variant="inherit" sx={{color: '#1F8B24'}}>Подтвержден</Typography>
                                                                ) : '-'}
                                                            </TableCell>
                                                            <TableCell style={{ maxWidth: 185 }}>{row.imageNames.map(url => (
                                                                <StyledImage key={url} sx={{backgroundImage: `url(${PATH_OVERHEADS_IMAGE + url})`}} onClick={() => dispatch(setPreviewImageUrl(PATH_OVERHEADS_IMAGE + url))}/>
                                                            ))}</TableCell>
                                                            <TableCell style={{ width: 120 }} align="right">
                                                                {!row.approved && (
                                                                    <EditButtonTable
                                                                        to={`/operations/${row.id}/edit`}
                                                                    />
                                                                )}
                                                                <DetailButtonTable
                                                                    to={`/operations/${row.id}/materials`}
                                                                />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </TableBody>
                                        ) : <LoadingTableBody loading={rowsLoading} error={rowsError} />}
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

export default OperationListView;