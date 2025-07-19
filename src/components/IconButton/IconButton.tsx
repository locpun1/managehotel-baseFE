import React from "react"
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps, Tooltip, TooltipProps } from "@mui/material"

interface IconButtonProps extends MuiIconButtonProps{
    tooltip?: string,
    tooltipPlacement?: TooltipProps['placement'],
    icon: React.ReactNode,
    width?:string | number,
    height?:string | number,
    border?: string,
    borderRadius?: string | number,
    backgroundColor?: string ,
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning',
    disabled?:boolean,
    handleFunt: Function,
    children?: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({
    tooltip,
    tooltipPlacement = "bottom",
    icon,
    width = "36px",
    height = "36px",
    border,
    borderRadius,
    backgroundColor,
    color = '',
    disabled,
    handleFunt,
    children,
    ...props
}) => {
    const handleClick = () => {
        handleFunt()
    }
    return(
        <Tooltip title={tooltip} placement={tooltipPlacement} arrow disableFocusListener disableHoverListener>
            <span>
                 {/* span wrapper để Tooltip hoạt động với disabled button */}
                <MuiIconButton
                    {...props}
                    onClick={handleClick}
                    sx={{
                        width,
                        height,
                        border,
                        borderRadius,
                        backgroundColor,
                        color,
                        '&:hover': {
                            color: 'white',
                            backgroundColor: backgroundColor, // hoặc 'transparent' nếu không muốn nền
                        },
                        '&.Mui-disabled':{
                            backgroundColor:backgroundColor,
                            color: 'white',
                            opacity: 0.5, // hoặc giữ nguyên 1 nếu không muốn bị mờ
                        },
                        ...props.sx
                    }}
                    disabled={disabled}
                >
                    {icon}
                </MuiIconButton>
                {children} 
            </span>
            
        </Tooltip>
    )
}

export default IconButton;