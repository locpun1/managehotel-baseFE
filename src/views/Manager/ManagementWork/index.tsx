import SearchBar from "@/components/SearchBar";
import { Box, Typography } from "@mui/material"
import { useState } from "react";
import DialogCreateTask from "../components/DialogCreateTask";

function ManagementWork (){
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
    const handleSearch = () => {
    }

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }
    return (
        <Box>
            <SearchBar
                onSearch={handleSearch}
                placeholder="Tìm kiếm"
                initialValue={searchTerm}
                onOpenDialogCreate={handleOpenCreateDialog}
            />
            <Box sx={{ display: 'flex' }}>
            </Box>
            <DialogCreateTask
                open={openCreateDialog}
                onClose={() => {
                    setOpenCreateDialog(false)
                }}
                title="Tạo công việc mới"
            />
        </Box>
    );
}

export default ManagementWork