import React from 'react';
import {NavLink as RouterLink} from "react-router-dom";
import {FiArrowRight} from "react-icons/fi";
import {IconButton} from "@mui/material";

const DetailButtonTable: React.FC<{to: string}> = ({to}) => (
    <IconButton
        size="large"
        component={RouterLink}
        to={to}
    >
        <FiArrowRight size={20}/>
    </IconButton>
);

export default React.memo(DetailButtonTable);