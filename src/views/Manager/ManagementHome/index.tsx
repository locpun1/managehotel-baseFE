import SearchBar from '@/components/SearchBar';
import { ROUTE_PATH } from '@/constants/routes';
import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CardInfo from '../components/CardInfoOfRoom';

const ManagementHome = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const handleSearch = () => {
  }
  
  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder='Tìm kiếm'
        initialValue={searchTerm}
        isCheckOpenCreate={location.pathname === `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`}
      />
      <Box sx={{ m:2}}>
        <Grid sx={{ display: 'flex', flexGrow: 1}} container spacing={3}>
          <Grid item xs={12} sm={6} lg={4}>
              <CardInfo/>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
              <CardInfo/>
          </Grid>
          <Grid item xs={12} sm={6} lg={4}>
              <CardInfo/>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagementHome;
