import React from 'react';
import {ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import { NavLink as RouterLink, LinkProps as RouterLinkProps} from 'react-router-dom';
import {IconType} from "react-icons";

const NavItem: React.FC<{href: string, title: string, icon: IconType}> = ({title, href, icon: Icon}) => {
    const renderLink = React.useMemo(
        () =>
            React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(function Link(
                itemProps,
                ref,
            ) {
                return <RouterLink
                    to={href}
                    ref={ref}
                    {...itemProps}
                    role={undefined}
                />;
            }),
        [href],
    );

    return (
        <ListItemButton component={renderLink} sx={{
            color: 'text.secondary',
            padding: '10px 8px',
            textTransform: 'none',
            letterSpacing: 0,
            '&.active': {
              color: 'secondary.main'
            },
            '&.active .MuiListItemIcon-root': {
                color: 'secondary.main'
            }
        }}>
            {Icon && (
                <ListItemIcon>
                    <Icon />
                </ListItemIcon>
            )}
            <ListItemText primary={title} sx={{margin: 0}} />
        </ListItemButton>
    );
};

export default NavItem;