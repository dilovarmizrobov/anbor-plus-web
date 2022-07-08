import React from 'react';
import {Button, Grid, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {FiPlusCircle} from "react-icons/fi";

const Header = () => {
    return (
        <Grid
            container
            justifyContent="space-between"
            spacing={3}
        >
            <Grid item>
                <Typography variant="h5" color="textPrimary">
                    Расходы
                </Typography>
            </Grid>
            <Grid item>
                <Button
                    variant="contained"
                    startIcon={<FiPlusCircle />}
                    component={RouterLink}
                    to="/outcomes/create"
                >
                    Добавить
                </Button>
            </Grid>
        </Grid>
    );
};

export default React.memo(Header);
