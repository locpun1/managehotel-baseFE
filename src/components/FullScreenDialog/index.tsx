import { Close } from "@mui/icons-material";
import { AppBar, Box, Dialog, IconButton, Slide, Toolbar, Typography } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { ReactNode } from "react";

interface FullScreenDialogProps{
    open: boolean,
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children:React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>
){
    return <Slide direction="left" ref={ref} {...props}/>
});

const FullScreenDialog = (props: FullScreenDialogProps) => {
    const { open, onClose, title, children, ...rest } = props;

    const handleClose = () => {
        onClose()
    }

    return(
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            {...rest}
            slots={{
                transition: Transition
            }}
            slotProps={{
               paper:{
                sx:{
                    width: { xs: '100%', md: '85%'},
                    mr: 0,
                    ml: 'auto'
                    
                }
               }
            }}
        >
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                >
                    <Close />
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {title}
                </Typography>
            </Toolbar>
        </AppBar>
        <Box>
            {children}
        </Box>
        </Dialog>
    )
}

export default FullScreenDialog;