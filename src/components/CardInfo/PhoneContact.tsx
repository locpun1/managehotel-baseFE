import useNotification from "@/hooks/useNotification";
import { Chat, ContentCopy, Phone } from "@mui/icons-material";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";

interface PhoneContactProps{
    phone: string,
    anchorEl: any,
    setAnchorEl: any
}

const PhoneContact = ({ phone, anchorEl, setAnchorEl }: PhoneContactProps) => {
    const notify = useNotification();
    const open = Boolean(anchorEl)
    const handleClose = () => setAnchorEl(null);
    const handleCopy = async () => {
        await navigator.clipboard.writeText(phone);
        notify({
            message: "Đã sao chép số điện thoại",
            severity: 'success'
        })
    };

    return(
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem>
                <ListItemIcon>
                    <Phone/>
                </ListItemIcon>
                <ListItemText primary='Gọi điện thoại'/>
                <IconButton edge='end' onClick={handleCopy}>
                    <ContentCopy sx={{ width: '15px', height: '15px'}}/>
                </IconButton>
            </MenuItem>
            <MenuItem
                onClick={() =>  window.open(`https://zalo.me/${phone}`)}
            >
                <ListItemIcon>
                    <Chat/>
                </ListItemIcon>
                <ListItemText primary='Nhắn zalo'/>
            </MenuItem>
        </Menu>
    )
}

export default PhoneContact;