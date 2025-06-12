import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  ListSubheader,
  SelectChangeEvent,
  SxProps,
  Theme,
  CircularProgress,
  SelectProps,
} from '@mui/material';

export interface Option {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

interface InputSelectProps {
  name: string;
  label: string;
  value: string | number | (string | number)[];
  onChange: (name: string, value: any) => void;
  options?: any[]; // dùng khi không group
  optionGroups?: OptionGroup[]; // dùng khi có group
  transformOptions?: (data: any[]) => Option[] | OptionGroup[];
  placeholder?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  multiple?: boolean;
  loading?:boolean;
  sx?: SxProps<Theme>;
  MenuProps?: SelectProps["MenuProps"];
}

const InputSelect: React.FC<InputSelectProps> = ({
  name,
  label,
  value,
  onChange,
  options = [],
  optionGroups,
  transformOptions,
  placeholder,
  error = false,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  multiple = false,
  loading=false,
  sx = {},
  MenuProps = undefined
}) => {
  const handleChange = (event: SelectChangeEvent<typeof value>) => {
    const selectedValue = multiple ? event.target.value : event.target.value;
    onChange(name, selectedValue);
  };


  const finalOptions = React.useMemo(() => {
    if (transformOptions) return transformOptions(options);
    if (optionGroups) return optionGroups;
    return options;
  }, [options, optionGroups, transformOptions]);

  const renderOptions = () => {
    if ( Array.isArray(finalOptions) && finalOptions.length > 0 && finalOptions[0] && 'options' in finalOptions[0]) {
      return (finalOptions as OptionGroup[]).map((group, i) => [
        <ListSubheader key={`group-${i}`}>{group.label}</ListSubheader>,
        ...group.options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
            {option.label}
          </MenuItem>
        )),
      ]);
    }
    
    if (loading) {
      return (
        <MenuItem disabled>
          <CircularProgress size={20} />
          &nbsp; Đang tải phòng...
        </MenuItem>
      );
    }

    if ((finalOptions as Option[]).length > 0) {
      return (finalOptions as Option[]).map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.icon && <span style={{ marginRight: 8 }}>{option.icon}</span>}
          {option.label}
        </MenuItem>
      ));
    }
    
    return <MenuItem disabled>Không có phòng</MenuItem>;
    
  };

  const getSelectedLabel = () => {
    const allOptions =
    Array.isArray(finalOptions) && finalOptions[0] && 'options' in finalOptions[0]
      ? (finalOptions as OptionGroup[]).flatMap((g) => g.options)
      : (finalOptions as Option[]);

    if (multiple && Array.isArray(value)) {
      return value
        .map((v) => allOptions.find((o) => o.value === v)?.label || v)
        .join(', ');
    }
    return allOptions.find((o) => o.value === value)?.label || '';
  };

  return (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          border: "1px solid rgb(82, 81, 81)",
          borderRadius: "8px",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          border: "1px solid rgb(82, 81, 81)",
        },
        ...sx,
      }}
    >
      <InputLabel id={`${name}-label`}>{label}</InputLabel>
      <Select
        labelId={`${name}-label`}
        id={`${name}-select`}
        name={name}
        value={value}
        onChange={handleChange}
        label={label}
        multiple={multiple}
        displayEmpty
        MenuProps={MenuProps}
        renderValue={(selected) => {
          if ((multiple && Array.isArray(selected) && selected.length === 0) || !selected) {
            return <span style={{ color: '#aaa' }}>{placeholder || label}</span>;
          }
          return getSelectedLabel();
        }}
      >
        {renderOptions()}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default InputSelect;
