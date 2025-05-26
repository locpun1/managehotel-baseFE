import { Grid, Stack } from "@mui/material";
import React from "react";
import InputSearch from "./InputSearch";
import Button from "../Button/Button";
import { AddCircleOutlineOutlined, Cached, FilterAltOutlined, NotificationsNone } from "@mui/icons-material";
import IconButton from "../IconButton/IconButton";

interface SearchBarProps{
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
    initialValue?: string;
}
const SearchBar: React.FC<SearchBarProps> = (props) => {
    const { placeholder,onSearch, initialValue } = props;
    return (
        <Grid sx={{backgroundColor:"white", px:1}} container>
            <Grid item xs={8}>
                <InputSearch
                    placeholder={placeholder}
                    initialValue={initialValue}
                    onSearch={onSearch}
                />
            </Grid>
            <Grid item xs={4}>
                <Stack direction='row' sx={{ display: 'flex', justifyContent:'end', mt: 2, mr:3}}>
                    <IconButton
                        handleFunt={() => {}}
                        icon={<NotificationsNone sx={{color: 'black', width:"28px", height:"28px"}}/>}
                        backgroundColor="white"
                        border="1px solid black"
                        borderRadius={6}
                        tooltip="Thông báo"
                        sx={{ mr: 2}}
                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<FilterAltOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        borderRadius={6}
                        tooltip="Lọc"

                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<Cached sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        borderRadius={6}
                        tooltip="Refresh"
                    />
                    <Button
                        handleFunt={() => {}}
                        leadingIcon={<AddCircleOutlineOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        width='120px'
                        height="37px"
                        borderRadius="6px"
                    >
                        Tạo mới
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default SearchBar;