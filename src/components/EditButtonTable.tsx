import React from 'react';
import {NavLink as RouterLink} from "react-router-dom";
import {FiEdit} from "react-icons/fi";
import {IconButton} from "@mui/material";

const EditButtonTable: React.FC<{to: string}> = ({to}) => (
    <IconButton
        size="large"
        component={RouterLink}
        to={to}
    >
        <FiEdit size={20}/>
    </IconButton>
);

export default React.memo(EditButtonTable);