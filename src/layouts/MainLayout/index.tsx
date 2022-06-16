import React, {useState} from "react";
import {Outlet} from "react-router-dom";
import {styled} from "@mui/material/styles";
import TopBar from "./TopBar";
import NavBar from './NavBar';
import {navConfigMain} from "../navConfig";

const PREFIX = 'MainLayout';

const classes = {
    root: `${PREFIX}-root`,
    wrapper: `${PREFIX}-wrapper`,
    contentContainer: `${PREFIX}-contentContainer`,
    content: `${PREFIX}-content`,
}

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        width: '100%'
    },
    [`& .${classes.wrapper}`]: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden',
        paddingTop: 64,
        [theme.breakpoints.up('lg')]: {
            paddingLeft: 256
        }
    },
    [`& .${classes.contentContainer}`]: {
        display: 'flex',
        flex: '1 1 auto',
        overflow: 'hidden'
    },
    [`& .${classes.content}`]: {
        flex: '1 1 auto',
        height: '100%',
        overflow: 'auto'
    },
}))

const MainLayout: React.FC = () => {
    const [isMobileNavOpen, setMobileNavOpen] = useState(false)

    return (
        <Root className={classes.root}>
            <TopBar onMobileNavOpen={() => setMobileNavOpen(true)} />
            <NavBar onMobileClose={() => setMobileNavOpen(false)} openMobile={isMobileNavOpen} navConfig={navConfigMain}/>
            <div className={classes.wrapper}>
                <div className={classes.contentContainer}>
                    <div className={classes.content}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </Root>
    )
}

export default MainLayout