import DialogComponent from "@/components/DialogComponent";
import { GroupTasks, Rooms } from "@/types/manager";
import { convertRoomPathToDisplayRemoteUrl } from "@/utils/url";
import { ContentCopy } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
interface DialogConformLinkProps{
    open: boolean,
    handleClose: () => void,
    title?: string
    displayedRooms: GroupTasks[], 
    generateGroupTaskId: number | string,
    handleCopy: () => void,
    link: string
}
const DialogConformLink: React.FC<DialogConformLinkProps> = (props) => {
    const { open, handleClose, title, displayedRooms, generateGroupTaskId,link, handleCopy} = props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            <Typography fontWeight={500}>
                {title ? `Đường link Phòng ${displayedRooms.find(r => r.id === generateGroupTaskId)?.room}` : `Tạo đường link thành công, Phòng: ${displayedRooms.find(r => r.id === generateGroupTaskId)?.room}`}
            </Typography>
            <Box sx={{ border: "1px solid rgb(164, 165, 165)", borderRadius: "5px", padding: 2, mt: 2 }} >
                <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                    {link !== undefined && convertRoomPathToDisplayRemoteUrl(link)}
                </Typography>
            </Box>
            <Button
                variant="contained"
                startIcon={<ContentCopy />}
                onClick={handleCopy}
                sx={{ mt: 2, backgroundColor: "#00C7BE" }}
            >
                Sao chép link
            </Button>
            <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ mt: 2, ml: 2 }}
            >
                Đóng
            </Button>
        </DialogComponent>
    )
}

export default DialogConformLink;