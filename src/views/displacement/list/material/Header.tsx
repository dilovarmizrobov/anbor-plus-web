import React from 'react';
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {Link as RouterLink} from "react-router-dom";

const Header: React.FC<{displacementId?: string}> = ({displacementId}) => {
    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/displacements" component={RouterLink}>
                    Перемещение
                </Link>
                <Typography color="text.primary">Накладная {displacementId}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                Накладная {displacementId}
            </Typography>
        </>
    );
};

export default React.memo(Header);
