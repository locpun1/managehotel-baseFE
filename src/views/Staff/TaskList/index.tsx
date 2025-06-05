import { Alert, Box, CircularProgress } from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';

const StaffTaskList = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = () => {
  }
  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}
      />
      <Box>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3}}>
            <CircularProgress/>
          </Box>
        )}
        {error && !loading && (
          <Alert severity='error' sx={{ my: 2}}>{error}</Alert>
        )}
        {!loading && !error && (
          <Box sx={{ m: 2}}>
            
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StaffTaskList;
