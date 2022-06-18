import React, {useEffect} from 'react';
import {Collapse, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {MdExpandLess, MdExpandMore} from "react-icons/md";
import {INavItem} from "../../navConfig";
import NavItem from "./NavItem";
import {useLocation} from "react-router-dom";

const NavCollapseItem: React.FC<{item: INavItem}> = ({item}) => {
    const [open, setOpen] = React.useState(false);
    const [isActive, setActive] = React.useState(false);
    const {title, icon: Icon, children} = item;
    const location = useLocation();

    useEffect(() => {
        let index = item.children!.findIndex(item => location.pathname.includes(item.href!))

        setActive(index > -1)
    }, [location])

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    onClick={handleClick}
                    sx={{
                        color: isActive ? 'secondary.main' : 'text.secondary',
                        padding: '10px 8px',
                    }}
                >
                    {Icon && <ListItemIcon sx={{minWidth: 30, color: isActive ? 'secondary.main' : 'text.secondary'}}>
                        <Icon size={20}/>
                    </ListItemIcon>}
                    <ListItemText primary={title} sx={{margin: 0}} />
                    {open ? <MdExpandLess size={20}/> : <MdExpandMore size={20}/>}
                </ListItemButton>
            </ListItem>
            <Collapse in={open} timeout="auto" sx={{ml: 2}}>
                {children!.map((child, key) => <NavItem key={key} item={child}/>)}
            </Collapse>
        </>
    );
};

export default NavCollapseItem;