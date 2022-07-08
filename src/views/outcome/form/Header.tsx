import React from 'react';
import {Breadcrumbs, Grid, Link, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";

const Header: React.FC<{ title?: string }> = ({title}) => (
    <Grid container justifyContent="space-between" spacing={3}>
        <Grid item>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/outcomes" component={RouterLink}>
                    Расходы
                </Link>
                <Typography color="text.primary">{title ? title : 'Создание'}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                {title ? 'Изменение расходы' : 'Создание расходы'}
            </Typography>
        </Grid>
    </Grid>
);

export default React.memo(Header);
