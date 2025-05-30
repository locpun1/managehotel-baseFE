import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";

interface DialogOpenGenerateCodeProps{
    open:boolean,
    handleClose: () => void,
    handleGenerate: () => void
}

const DialogOpenGenerateCode: React.FC<DialogOpenGenerateCodeProps> = (props) => {
    const { open, handleClose, handleGenerate } =  props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            <Typography fontWeight={500}>
                Bạn có chắc chắn muốn tạo đường link web cho display remote của mỗi phòng không?
            </Typography>
            <Button
                variant="contained"
                onClick={handleGenerate}
                sx={{ mt: 2, backgroundColor: "#00C7BE" }}
            >
                Tạo link
            </Button>
            <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ mt: 2, ml: 2 }}
            >
                Hủy
            </Button>
        </DialogComponent>
    )
}

export default DialogOpenGenerateCode;