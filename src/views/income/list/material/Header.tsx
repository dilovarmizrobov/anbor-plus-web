import React from 'react';
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {Link as RouterLink} from "react-router-dom";

const Header: React.FC<{incomeId?: string}> = ({incomeId}) => {
    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/incomes" component={RouterLink}>
                    Приходы
                </Link>
                <Typography color="text.primary">Накладная {incomeId}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                Накладная {incomeId}
            </Typography>
        </>
    );
};

export default React.memo(Header);