import React from 'react';
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {Link as RouterLink} from "react-router-dom";

const Header: React.FC<{outcomeId?: string}> = ({outcomeId}) => {
    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/outcomes" component={RouterLink}>
                    Расходы
                </Link>
                <Typography color="text.primary">Накладная {outcomeId}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                Накладная {outcomeId}
            </Typography>
        </>
    );
};

export default React.memo(Header);
