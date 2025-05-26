import { Box, Container } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';

const Home = () => {
  const { t } = useTranslation();
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
};

export default Home;
