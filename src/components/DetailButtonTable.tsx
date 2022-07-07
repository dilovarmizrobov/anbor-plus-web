import React from 'react';
import {NavLink as RouterLink} from "react-router-dom";
import {IconButton} from "@mui/material";
import {FiArrowRight} from "react-icons/fi";

const DetailButtonTable :React.FC<{to: string}>= ({to}) => {
    return (
        <IconButton
            size="large"
            to={to}
            component={RouterLink}
        >
            <FiArrowRight size={20} />
        </IconButton>
    );
};

export default DetailButtonTable;
