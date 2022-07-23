import React from 'react';
import {Breadcrumbs, Link, Typography} from "@mui/material";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";
import {Link as RouterLink} from "react-router-dom";

const Header: React.FC<{title: string}> = ({title}) => {
    return (
        <>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/operations" component={RouterLink}>
                    Операции
                </Link>
                <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                {title}
            </Typography>
        </>
    );
};

export default React.memo(Header);