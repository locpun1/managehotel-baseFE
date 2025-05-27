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
    onOpenDialogCreate?: () =>  void;
    isCheckOpenCreate?:boolean
}
const SearchBar: React.FC<SearchBarProps> = (props) => {
    const { placeholder,onSearch, initialValue,onOpenDialogCreate, isCheckOpenCreate=false } = props;
    return (
        <Grid sx={{backgroundColor:"white", px:1}} container>
            <Grid item xs={12} sm={8}>
                <InputSearch
                    placeholder={placeholder}
                    initialValue={initialValue}
                    onSearch={onSearch}
                />
            </Grid>
            <Grid item xs={12} sm={4}>
                <Stack direction='row' sx={{ display: 'flex', justifyContent: {xs: 'start', sm:'end'}, mt: { sm: 2}, mb: { xs: 1, sm: 0}, mx:{ sm: 3}}}>
                    <IconButton
                        handleFunt={() => {}}
                        icon={<NotificationsNone sx={{color: 'black', width:"28px", height:"28px"}}/>}
                        backgroundColor="white"
                        border="1px solid black"
                        borderRadius={1}
                        tooltip="Thông báo"
                        sx={{ mr: 2}}
                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<FilterAltOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        borderRadius={1}
                        tooltip="Lọc"

                    />
                    <IconButton
                        handleFunt={() => {}}
                        icon={<Cached sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        borderRadius={1}
                        tooltip="Refresh"
                    />
                    {!isCheckOpenCreate &&
                        <Button
                            handleFunt={() => onOpenDialogCreate && onOpenDialogCreate()}
                            leadingIcon={<AddCircleOutlineOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                            backgroundColor="#00C7BE"
                            width='120px'
                            height="37px"
                            borderRadius="6px"
                        >
                            Tạo mới
                        </Button>
                    }
                </Stack>
            </Grid>
        </Grid>
    )
}

export default SearchBar;