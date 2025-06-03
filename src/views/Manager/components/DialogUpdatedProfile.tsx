import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";

interface DialogUpdatedProfileProps{
    open:boolean | null,
    handleClose: () => void,
}

const DialogUpdatedProfile: React.FC<DialogUpdatedProfileProps> = (props) => {
    const { open, handleClose } =  props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            <Typography fontWeight={500}>
                Chúc mừng bạn vừa chỉnh sửa hồ sơ thành công
            </Typography>
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

export default DialogUpdatedProfile;