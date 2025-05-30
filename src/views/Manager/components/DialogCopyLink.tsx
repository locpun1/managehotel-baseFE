import DialogComponent from "@/components/DialogComponent";
import { Button, Typography } from "@mui/material";
import React from "react";

interface DialogCopyLinkProps{
    open:boolean,
    handleClose: () => void,
}

const DialogCopyLink: React.FC<DialogCopyLinkProps> = (props) => {
    const { open, handleClose } =  props;
    return(
        <DialogComponent
            dialogKey={open}
            handleClose={handleClose}
            isActiveFooter={false}
        >
            <Typography fontWeight={500}>
                Sao chép đường link thành công
            </Typography>
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

export default DialogCopyLink;