import { Grid, Stack } from "@mui/material";
import React from "react";
import InputSearch from "./InputSearch";
import Button from "../Button/Button";
import { Add, AddCircleOutlineOutlined, Cached, FilterAlt, FilterAltOutlined, NotificationsNone } from "@mui/icons-material";

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
                <Stack direction='row' sx={{ display: 'flex', justifyContent:'end', mt: 2}}>
                    <Button
                        handleFunt={() => {}}
                        leadingIcon={<NotificationsNone sx={{color: 'black', width: "28px", height:"28px"}}/>}
                        backgroundColor="white"
                        border="1px solid black"

                    />
                    <Button
                        handleFunt={() => {}}
                        leadingIcon={<FilterAltOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"

                    />
                    <Button
                        handleFunt={() => {}}
                        leadingIcon={<Cached sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"

                    />
                    <Button
                        handleFunt={() => {}}
                        leadingIcon={<AddCircleOutlineOutlined sx={{color: 'white', width: "28px", height:"28px"}}/>}
                        backgroundColor="#00C7BE"
                        width='120px'

                    >
                        Tạo mới
                    </Button>
                </Stack>
            </Grid>
        </Grid>
    )
}

export default SearchBar;