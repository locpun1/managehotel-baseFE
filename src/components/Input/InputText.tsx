import React, { forwardRef, useEffect, useState } from "react";
import "./Input.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import SearchIcon from "@mui/icons-material/Search";

interface InputTextProps {
  value: number | string | Date | null;
  id?: string;
  onChange: (value: string | Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  type?: "text" | "number" | "date" | "time";
  validate?: (value: string) => string | null;
  allowSpecialCharacters?: boolean;
  phoneNumber?: boolean;
  handleInputOnclick?: () => void;
  showSearchIcon?: boolean;
  maxLength?: number;
  border?: string;
  startDate?: Date;
  endDate?: Date;
  interviewDate?: Date;
}

const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <input
    {...props}
    ref={ref}
    onInput={(e) => {
      const input = e.target as HTMLInputElement;
      let value = input.value.replace(/[^0-9]/g, "");
      if (value.length > 4) value = value.slice(0, 4) + "/" + value.slice(4);
      if (value.length > 7) value = value.slice(0, 7) + "/" + value.slice(7);

      input.value = value.slice(0, 10);
    }}
    placeholder="yyyy/mm/dd"
  />
));

const InputText: React.FC<InputTextProps> = ({
  value = "",
  onChange,
  placeholder = "",
  disabled = false,
  style = {},
  width,
  height,
  borderRadius = "8px",
  type = "text",
  validate,
  allowSpecialCharacters = true,
  phoneNumber = false,
  handleInputOnclick,
  showSearchIcon = false,
  maxLength,
  border,
  startDate = new Date("1900-01-01"),
  endDate = new Date("2099-12-31"),
  interviewDate,
}) => {
  const [inputValue, setInputValue] = useState<string>(
    value ? String(value) : "",
  );
  const handleValidation = () => {
    if (validate) {
      return validate(inputValue);
    }
    return null;
  };

  const formatPhoneNumber = (inputValue: string) => {
    let formattedValue = inputValue.replace(/[^0-9]/g, "");
    if (formattedValue.length > 3) {
      formattedValue = formattedValue.replace(/(\d{3})(\d)/, "$1-$2");
    }
    if (formattedValue.length > 8) {
      formattedValue = formattedValue.replace(/(\d{3}-\d{4})(\d+)/, "$1-$2");
    }
    return formattedValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    let formattedValue = "";
    if (type === "number") {
      newValue = newValue.replace(/[^0-9]/g, "");
    }

    if (!allowSpecialCharacters) {
      newValue = newValue.replace(/[^a-zA-Z0-9\s]/g, "");
    }
    if (phoneNumber) {
      let formattedValue = formatPhoneNumber(newValue);
      if (formattedValue.replace(/[^0-9]/g, "").length > 11) {
        return;
      }
      setInputValue(formattedValue);
      onChange(formattedValue);
      return;
    }
    setInputValue(phoneNumber ? formattedValue : newValue);
    if (type !== "date" && type !== "time") {
      onChange(phoneNumber ? formattedValue : newValue);
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setInputValue(date.toLocaleDateString());
    } else {
      setInputValue("");
    }
    onChange(date);
  };

  useEffect(() => {
    if (value) {
      setInputValue(String(value));
    }
  }, [value]);

  return (
    <div className="input-container" style={{ width: "100%" }}>
      <div
        className="input-wrapper"
        style={{
          width: width || "100px",
          height: height || "30px",
          borderRadius,
          border,
          ...style,
        }}
      >
        {showSearchIcon && (
          <SearchIcon fontSize="small" style={{ color: "#6c757d" }} />
        )}
        {type === "date" ? (
          <>
            <FaCalendarAlt size={18} style={{ color: "#6c757d" }} />
            <DatePicker
              selected={value instanceof Date ? value : null}
              onChange={handleDateChange}
              onChangeRaw={(e) => {
                const target = e?.target as HTMLInputElement;
                onChange(target.value);
              }}
              placeholderText={placeholder}
              disabled={disabled}
              className="datepicker-input"
              dateFormat="yyyy/MM/dd"
              minDate={startDate}
              maxDate={endDate}
              customInput={<CustomInput />}
            />
          </>
        ) : type === "time" ? (
          <>
            <DatePicker
              selected={value instanceof Date ? value : null}
              onChange={handleDateChange}
              placeholderText={placeholder}
              disabled={disabled}
              className="datepicker-input"
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeFormat="HH:mm"
              dateFormat="HH:mm"
              minDate={startDate}
              maxDate={endDate}
              filterTime={(time) => {
                const selectedHours = time.getHours();
                const selectedMinutes = time.getMinutes();

                const isToday = interviewDate
                  ? new Date(interviewDate).setHours(0, 0, 0, 0) ===
                    new Date().setHours(0, 0, 0, 0)
                  : false;

                const now = new Date();
                const currentHours = now.getHours();
                const currentMinutes = now.getMinutes();

                const isInRange =
                  (selectedHours > 8 ||
                    (selectedHours === 8 && selectedMinutes >= 0)) &&
                  (selectedHours < 20 ||
                    (selectedHours === 20 && selectedMinutes === 0));

                if (isToday) {
                  return (
                    isInRange &&
                    (selectedHours > currentHours ||
                      (selectedHours === currentHours &&
                        selectedMinutes > currentMinutes))
                  );
                }

                return isInRange;
              }}
            />
          </>
        ) : (
          <input
            type="text"
            value={value as string}
            onChange={handleInputChange}
            onClick={() => {
              handleInputOnclick && handleInputOnclick();
            }}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            style={{ ...style }}
          />
        )}
      </div>
      {handleValidation() && (
        <span className="error-message">{handleValidation()}</span>
      )}
    </div>
  );
};

export default InputText;
