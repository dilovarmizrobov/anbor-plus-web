import React from 'react';
import {Breadcrumbs, Grid, Link, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MdNavigateNext as NavigateNextIcon} from "react-icons/md";

const Header: React.FC<{ id?: number }> = ({id}) => (
    <Grid container justifyContent="space-between" spacing={3}>
        <Grid item>
            <Breadcrumbs separator={<NavigateNextIcon/>} aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/operations" component={RouterLink}>
                    Операции
                </Link>
                <Typography color="text.primary">{id ? id : 'Создание'}</Typography>
            </Breadcrumbs>
            <Typography variant="h5" color="textPrimary">
                {id ? 'Изменение операции' : 'Создание операции'}
            </Typography>
        </Grid>
    </Grid>
);

export default React.memo(Header);
