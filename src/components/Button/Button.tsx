import React, { useState } from 'react'
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import './Button.scss'

interface ButtonProps extends MuiButtonProps {
  customVariant?: 'primary' | 'secondary' | 'outline' | 'createButton' | 'switchButton'
  width?: string | number
  height?: string | number
  fontSize?: string
  fontWeight?: string
  fontFamily?: string
  border?: string
  backgroundColor?: string
  fontColor?: string
  borderRadius?: string
  handleFunt: Function
  padding?: string
  isEdit?: boolean
  disabled?: boolean
  leadingIcon?: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  customVariant = '',
  width = '100px',
  height = '40px',
  fontSize = '12px',
  fontWeight,
  fontFamily,
  border,
  backgroundColor,
  fontColor,
  borderRadius,
  padding,
  children,
  handleFunt,
  isEdit = false,
  disabled = false,
  leadingIcon, 
  ...props }) => {
  const [on, setOn] = useState<boolean>(false)

  const handleToggle = () => {
    if (customVariant === 'switchButton') {
      setOn(!on)
    }
    handleFunt()
  }

  const getButtonStyles = () => {
    switch (customVariant) {
      case 'primary':
        return 'primary'
      case 'secondary':
        return 'secondary'
      case 'outline':
        return 'outline'
      case 'createButton':
        return 'createButton'
      case 'switchButton':
        return on ? 'switch-on' : 'switch-off'
      default:
        return 'default'
    }
  }

  const iconToDisplay = customVariant === 'createButton' ? <AddIcon /> : leadingIcon;

  return (
    <MuiButton
      {...props}
      startIcon={iconToDisplay}
      className={`root ${getButtonStyles()} ${customVariant === 'switchButton' ? 'toggle-switch' : ''}`}
      style={{
        width,
        height,
        fontSize,
        fontWeight,
        fontFamily,
        border,
        padding,
        backgroundColor,
        color: fontColor,
        borderRadius,
        ...props.style
      }}
      onClick={handleToggle}
      disabled={disabled || isEdit}
    >
      {customVariant === 'switchButton' ? (
        <div className="toggle-switch-container">
          <div className={`toggle-switch ${on ? 'on' : 'off'}`}>
            <div className={`toggle-thumb ${on ? 'on' : ''}`}></div>
          </div>
        </div>
      ) : (
        children
      )}
    </MuiButton>
  )
}

export default Button
