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
    handleFunt: Function
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
    ...props
}) => {
    const handleClick = () => {
        handleFunt()
    }
    return(
        <Tooltip title={tooltip} placement={tooltipPlacement}>
            <span>
                 {/* span wrapper để Tooltip hoạt động với disabled button */}
                <MuiIconButton
                    {...props}
                    onClick={handleClick}
                    style={{
                        width,
                        height,
                        border,
                        borderRadius,
                        backgroundColor,
                        color,
                        ...props.style
                    }}
                    disabled={disabled}
                >
                    {icon}
                </MuiIconButton> 
            </span>

        </Tooltip>
    )
}

export default IconButton;