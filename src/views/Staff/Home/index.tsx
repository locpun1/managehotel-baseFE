import { Box } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';

const StaffHome = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => {}

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
};

export default StaffHome;
