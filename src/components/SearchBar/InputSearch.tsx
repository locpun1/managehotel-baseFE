import { Search } from "@mui/icons-material";
import { Box, Divider, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";

interface InputSearchProps{
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
    initialValue?: string;
}

const InputSearch: React.FC<InputSearchProps> = (props) => {
    const { onSearch, placeholder, initialValue = " "} = props;
    const [searchTerm, setSearchTerm] = useState<string>(initialValue);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
        onSearch(searchTerm);
        }
    };
    return (
        <Box
            sx={{
                width:'100%',
                margin: "12px auto",
                overflow: "hidden"
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                    startAdornment:(
                        <InputAdornment
                            position="start"
                            sx={{
                                height:"100%", // Đảm bảo InputAdornment chiếm toàn bộ chiều cao của input
                                maxHeight:"none", // Override default maxHeight
                                marginRight:0, // Remove default margin-right
                                display: "flex",
                                alignItems: "center", // Căn giữa icon và divider theo chiều dọc
                                justifyContent: 'center', // Căn giữa nội dung trong adornment
                                paddingLeft: "12px", // Padding cho icon bên trái
                                paddingRight: "12px" // Padding cho divider bên phải
                            }}
                        >
                            <Search/>
                            <Divider orientation="vertical" flexItem sx={{ ml:1.5}}/>{" "}
                        </InputAdornment>
                    ),
                    sx:{
                        "& .MuiOutlinedInput-notchedOutline":{
                            borderColor:"#CFCFCF"
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#CFCFCF",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#f0f2f5",
                        },
                        ".MuiInputBase-input":{
                            padding: "12px 14px", // Điều chỉnh padding cho text input, bỏ padding trái vì adornment đã lo
                            paddingLeft:0 // Bỏ padding mặc định bên trái vì đã có adornment
                        },
                        // Áp dụng border radius cho chính input field
                        borderRadius: "8px",
                    },
                }}
                sx={{
                    // Đảm bảo TextField root không có padding và áp dụng border radius
                    "& .MuiInputBase-root":{
                        padding:0, // Loại bỏ padding mặc định của root input base
                        borderRadius:"8px" // Áp dụng border radius cho toàn bộ TextField
                    }
                }}
            />
        </Box>
    )
}

export default InputSearch