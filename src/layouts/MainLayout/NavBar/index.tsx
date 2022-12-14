import React, {useEffect} from 'react';
import {Box, Divider, Drawer, Hidden, List, ListSubheader, Typography} from "@mui/material";
import { useLocation } from 'react-router';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {useAppSelector} from "../../../store/hooks";
import {selectAuth} from "../../../store/reducers/authSlice";
import {UserRolesEnum, UserRolesMap} from "../../../constants";
import NavItem from "./NavItem";
import hasPermission from "../../../utils/hasPermisson";
import {INavConfig, INavItem} from "../../navConfig";
import NavCollapseItem from "./NavCollapseItem";
import AutocompleteInput from "./AutocompleteInput";
import PERMISSIONS from "../../../constants/permissions";

const filterNavItem = (items: INavItem[]) => {
    return items.filter(item => {
        if (item.children) {
            item.children = item.children.filter(child => child.perm ? hasPermission(child.perm) : true)
            if (item.children.length === 0) return false
        }

        return item.perm ? hasPermission(item.perm) : true
    })
}

const Index: React.FC<{openMobile: boolean, onMobileClose: VoidFunction, navConfig: INavConfig[]}> = (props) => {
    const {openMobile, onMobileClose, navConfig} = props
    const location = useLocation();
    const {user} = useAppSelector(selectAuth)
    const isWarehouseman = hasPermission(PERMISSIONS.WAREHOUSEMAN)

    useEffect(() => {
        if (openMobile && onMobileClose) {
            onMobileClose();
        }
        // eslint-disable-next-line
    }, [location.pathname]);

    const content = (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
        >
            <PerfectScrollbar options={{ suppressScrollX: true }}>
                <Hidden lgUp>
                    <Box sx={{m: 2, color: "black", fontSize: '1.2rem'}} textAlign="center">
                        Anbor plus
                    </Box>
                </Hidden>
                <Box m={3}>
                    <Box textAlign="center">
                        <Typography variant="h6">
                            {user!.fullName}
                        </Typography>
                        {isWarehouseman && (
                            <Typography variant="body1">
                                {user!.warehouse.name}
                            </Typography>
                        )}
                        <Typography variant="body2" color="textSecondary">
                            {UserRolesMap.get(user!.role)}
                        </Typography>
                    </Box>
                </Box>
                {
                    (user!.role !== UserRolesEnum.WAREHOUSEMAN) && (
                        <Box px={2} my={3}>
                            <AutocompleteInput />
                        </Box>
                    )
                }
                <Divider />
                <Box p={2}>
                    {navConfig.map((config, index) => {
                        const items = filterNavItem(config.items)

                        return items.length > 0 && (
                            <List key={index}
                                  subheader={(
                                      <ListSubheader disableGutters disableSticky>{config.subheader}</ListSubheader>
                                  )}
                            >
                                {items.map((item, index) => item.children
                                    ? <NavCollapseItem key={index} item={item}/>
                                    : <NavItem key={index} item={item}/>)}
                            </List>
                        )
                    })}
                </Box>
            </PerfectScrollbar>
        </Box>
    )

    return (
        <>
            <Drawer
                anchor="left"
                sx={{
                    display: { md: 'block', lg: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 256 },
                }}
                onClose={onMobileClose}
                open={openMobile}
                variant="temporary"
                ModalProps={{keepMounted: true}}
            >
                {content}
            </Drawer>
            <Drawer
                anchor="left"
                sx={{
                    display: { xs: 'none', lg: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 256,
                        top: 64,
                        height: 'calc(100% - 64px)',
                        zIndex: 1000
                    },
                }}
                open
                variant="permanent"
            >
                {content}
            </Drawer>
        </>
    );
};

export default Index;