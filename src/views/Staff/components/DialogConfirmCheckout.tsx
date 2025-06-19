import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";

interface DialogConfirmCheckoutProps{
    open:boolean,
    total: number,
    roomName: string,
    handleClose: () => void,
}

const DialogConfirmCheckout: React.FC<DialogConfirmCheckoutProps> = (props) => {
    const { open, handleClose, roomName, total } =  props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            <Typography fontWeight={500}>
                Bạn đã hoàn thành công việc và được tick để tính công.
            </Typography>
            <Typography fontWeight={500}>
                {`Tổng thời gian dọn phòng ${roomName} là: ${total} phút.`}
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

export default DialogConfirmCheckout;