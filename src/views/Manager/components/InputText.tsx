import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import {
  DatePicker,
  DatePickerProps,
  DateTimePicker,
  DateTimePickerProps,
} from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

type CustomInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'date'
  | 'datetime';

interface CustomInputProps {
  type: CustomInputType;
  placeholder?:string,
  name: string;
  label: string;
  value: string | Dayjs | null | number;
  onChange: (name: string, value: string | Dayjs | null | number) => void;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  fullWidth?: boolean;
  margin?: TextFieldProps['margin'];
  variant?: TextFieldProps['variant'];
  disabled?: boolean;
  sx?: SxProps<Theme>;
  multiline?: boolean;
  rows?: number;
  textFieldProps?: Omit<
    TextFieldProps,
    | 'type' | 'name' | 'label' | 'value' | 'onChange' | 'error' | 'helperText'
    | 'required' | 'fullWidth' | 'margin' | 'variant' | 'disabled' | 'sx' | 'onFieldBlur'
  >;
  datePickerProps?: Omit<
    DatePickerProps<Dayjs>,
    | 'value' | 'onChange' | 'label' | 'disabled' | 'slotProps' | 'sx' 
  >;
  dateTimePickerProps?: Omit<
    DateTimePickerProps<Dayjs>,
    | 'value' | 'onChange' | 'label' | 'disabled' | 'slotProps' | 'sx' 
  >;
}

const InputText: React.FC<CustomInputProps> = ({
  type,
  name,
  label,
  value,
  placeholder,
  onChange,
  error = false,
  helperText,
  required = false,
  fullWidth = true,
  margin = 'normal',
  variant = 'outlined',
  disabled = false,
  sx = {},
  multiline = false,
  rows,
  textFieldProps = {},
  datePickerProps = {},
  dateTimePickerProps = {},
}) => {

  const commonSlotTextFieldProps = {
    name, label, required, error, helperText, fullWidth, margin, variant, disabled,
  };

  const directTextFieldBaseProps = {
    name, label, required, error, helperText, fullWidth, margin, variant, disabled,
  };


  if (type === 'date') {
    return (
      <DatePicker
        label={label}
        value={value as Dayjs | null}
        onChange={(newValue: Dayjs | null) => onChange(name, newValue)}
        disabled={disabled}
        sx={sx}
        slotProps={{
          textField: { ...commonSlotTextFieldProps },
        }}
        format="DD/MM/YYYY"
        {...datePickerProps}
      />
    );
  }

  if (type === 'datetime') {
    return (
      <DateTimePicker
        label={label}
        value={value as Dayjs | null}
        onChange={(newValue: Dayjs | null) => onChange(name, newValue)}
        disabled={disabled}
        sx={sx}
        slotProps={{
          textField: { ...commonSlotTextFieldProps },
        }}
        ampm={false}
        format="DD/MM/YYYY HH:mm"
        {...dateTimePickerProps}
      />
    );
  }

  const finalTextFieldProps: TextFieldProps = {
    ...textFieldProps,
    type: (type === 'text' && multiline) ? undefined : type,
    value: value as string | number,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(name, event.target.value),
    name,
    label,
    required,
    placeholder,
    error,
    helperText,
    fullWidth,
    margin,
    variant,
    disabled,
    sx,
    multiline: multiline,
    rows: multiline ? rows : undefined, 
  };


  return (
    <TextField
        InputProps={{
            sx:{
                "& .MuiOutlinedInput-notchedOutline":{
                    border:"1px solid rgb(82, 81, 81)",
                    borderRadius:"8px",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border:"1px solid rgb(82, 81, 81)"
                },
            }
        }}
        sx={{
          ...sx,
        }}
      {...finalTextFieldProps}
    />
  );
};

export default InputText;