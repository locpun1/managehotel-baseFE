import IconButton from "@/components/IconButton/IconButton";
import CommonImage from "@/components/Image/index";
import { getPathImage } from "@/utils/url";
import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";

interface OpenImageProps{
    open: boolean,
    imageUrl: string;
    onClose: () => void;
}

const DialogOpenImage = (props: OpenImageProps) => {
    const {open, imageUrl, onClose} = props;

    const handleClose = () => {
        onClose()
    }
    return (
        <Dialog 
            open={open}
            onClose={handleClose}
            maxWidth='md'
            fullWidth
            scroll="paper"
            aria-labelledby="open-image"
        >
            <DialogTitle id='open-image'>
                <IconButton
                    handleFunt={handleClose}
                    icon={<Close sx={{ color: (theme) => theme.palette.grey[800]}} />}
                    sx={{ position: 'absolute', right: 8, top: 0}}
                />
            </DialogTitle>
            <DialogContent>
                <CommonImage
                    src={imageUrl && getPathImage(imageUrl)}
                />
            </DialogContent>
        </Dialog>
    )
}

export default DialogOpenImage;