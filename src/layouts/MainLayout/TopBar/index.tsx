import React from "react";
import {AppBar, Box, Hidden, IconButton, Toolbar} from "@mui/material";
import {FiMenu} from 'react-icons/fi';
import {styled} from "@mui/material/styles";
import Logout from "./Logout";

const PREFIX = "TopBar"
const classes = {
    root: `${PREFIX}-root`,
    toolbar: `${PREFIX}-toolbar`,
}

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.root}`]: {
        ...theme.palette.mode === 'light' ? {
            boxShadow: 'none',
            backgroundColor: theme.palette.primary.main
        } : {},
        ...theme.palette.mode === 'dark' ? {
            backgroundColor: theme.palette.background.default
        } : {}
    },
    [`& .${classes.toolbar}`]: {
        minHeight: 64,
    },
}))

const TopBar: React.FC<{onMobileNavOpen: VoidFunction}> = ({onMobileNavOpen}) => {
    return (
        <Root>
            <AppBar className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Hidden lgUp>
                        <IconButton
                            color="inherit"
                            onClick={onMobileNavOpen}
                        >
                            <FiMenu/>
                        </IconButton>
                    </Hidden>
                    <Hidden lgDown>
                        <Box sx={{color: "white", fontSize: '1.2rem'}} textAlign="center">
                            Anbor plus
                        </Box>
                    </Hidden>
                    <Box ml={2} flexGrow={1}/>
                    <Logout/>
                </Toolbar>
            </AppBar>
        </Root>
    )
}

export default TopBar