import React, {useState} from "react";
import {IconButton, SvgIcon, Tooltip} from "@mui/material";
import {useAppDispatch} from "../../../store/hooks";
import {FiLogOut as LogOutIcon} from "react-icons/fi"
import {logout} from "../../../store/reducers/authSlice";
import ConfirmationModal from "../../../components/ConfirmationModal";

const Logout: React.FC = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setOpen] = useState(false);

    const handleLogout = () => {
        setOpen(false)
        dispatch(logout())
    };

    return (
        <>
            <Tooltip title="Выйти">
                <IconButton
                    color="inherit"
                    onClick={() => setOpen(true)}
                >
                    <SvgIcon>
                        <LogOutIcon />
                    </SvgIcon>
                </IconButton>
            </Tooltip>
            <ConfirmationModal
                isOpen={isOpen}
                title="Выхода из аккаунта"
                description="Вы действительно хотите выйти из аккаунта?"
                onClose={() => setOpen(false)}
                onAccept={handleLogout}
            />
        </>
    )
}

export default Logout
