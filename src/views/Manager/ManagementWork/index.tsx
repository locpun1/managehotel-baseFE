import SearchBar from "@/components/SearchBar";
import { Box, Typography } from "@mui/material"
import { useState } from "react";

function ManagementWork (){
    const [searchTerm, setSearchTerm] = useState<string>('')
    const handleSearch = () => {
    }
    return (
        <Box>
            <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm"
                initialValue={searchTerm}
            />
        <Box sx={{ display: 'flex' }}>
        </Box>
        </Box>
    );
}

export default ManagementWork