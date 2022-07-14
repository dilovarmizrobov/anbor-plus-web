import React, {useEffect} from 'react';
import {Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {FiEdit, FiPlusCircle, FiTrash} from "react-icons/fi";
import {MaterialUnitMap} from "../../../constants";
import {
    deleteMaterial,
    handleEditMaterial,
    selectOverheadMaterial, handleAddMaterial
} from "../../../store/reducers/overheadMaterialSlice";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import CreateEditFormModal from "./CreateEditFormModal";
import {useSnackbar} from "notistack";

const OverheadMaterialList = () => {
    const dispatch = useAppDispatch()
    const {enqueueSnackbar} = useSnackbar()
    const {materials, openModal, materialDuplicate} = useAppSelector(selectOverheadMaterial)

    useEffect(() => {
        if (materialDuplicate) {
            enqueueSnackbar('Материал уже существует', {variant: 'info'})
        }
    }, [enqueueSnackbar, materialDuplicate])

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Материал</TableCell>
                            <TableCell>Марка</TableCell>
                            <TableCell>Артикул</TableCell>
                            <TableCell>Кол-во</TableCell>
                            <TableCell/>
                            <TableCell align="right">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => dispatch(handleAddMaterial())}
                                >
                                    <FiPlusCircle size={20} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {materials.map((material, index) => (
                            <TableRow hover key={material.mark!.sku}>
                                <TableCell>{material.material!.name}</TableCell>
                                <TableCell>{material.mark!.name}</TableCell>
                                <TableCell>{material.mark!.sku}</TableCell>
                                <TableCell>{material.qty} {MaterialUnitMap.get(material.material!.unit)}</TableCell>
                                <TableCell/>
                                <TableCell sx={{width: 120}}>
                                    <IconButton
                                        size="large"
                                        onClick={() => dispatch(handleEditMaterial({index, material}))}
                                    >
                                        <FiEdit size={20}/>
                                    </IconButton>
                                    <IconButton
                                        size="large"
                                        onClick={() => dispatch(deleteMaterial(material.mark!.sku))}
                                    >
                                        <FiTrash size={20} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {openModal && <CreateEditFormModal/>}
        </>
    );
};

export default OverheadMaterialList;