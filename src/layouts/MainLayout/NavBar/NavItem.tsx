import React from 'react';
import {ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import { NavLink as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom';
import {INavItem} from "../../navConfig";

const NavItem: React.FC<{item: INavItem}> = ({item}) => {
    const {title, href, icon: Icon} = item
    const renderLink = React.useMemo(() =>
        React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>((props, ref) => {
            return <RouterLink
                to={item.href!}
                ref={ref}
                {...props}
            />;
        }), [href],
    );

    return (
        <ListItem disablePadding>
            <ListItemButton
                component={renderLink}
                sx={{
                    color: 'text.secondary',
                    padding: '10px 8px',
                    '&.active': {
                      color: 'secondary.main'
                    },
                    '&.active .MuiListItemIcon-root': {
                        color: 'secondary.main'
                    }
                }}
            >
                {Icon && <ListItemIcon sx={{minWidth: 30}}><Icon size={20}/></ListItemIcon>}
                <ListItemText primary={title} sx={{margin: 0}} />
            </ListItemButton>
        </ListItem>
    );
};

export default React.memo(NavItem);