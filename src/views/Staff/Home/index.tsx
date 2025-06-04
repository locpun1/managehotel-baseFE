import { Box, Paper} from '@mui/material';
import SearchBar from '@/components/SearchBar';
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import useAuth from '@/hooks/useAuth';
import CardInfoManager from '@/components/CardInfo/CardInfoManager';
import CardInfoStaff from '@/components/CardInfo/CardInfoStaff';

const StaffHome = () => {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const handleSearch = () => {}
  const { profile } = useAuth();

  return (
    <Box>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Tìm kiếm"
        initialValue={searchTerm}

      />
      <Grid container spacing={2} sx={{ m:2}}>
        <Grid size={{ xs:12, md: 9.5}}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    Dọn dẹp vệ sinh phòng 201
                  </Paper>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md:4}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    Mã QR của bạn
                  </Paper>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8}}>
                <Box>
                  <Paper elevation={2} sx={{ padding: 1, borderRadius: '8px', border: '1px solid #e0e0e0',height: '50%' }}>
                    Danh sách công việc
                  </Paper>
                </Box>
              </Grid>
            </Grid>
        </Grid>
        <Grid size={{ xs:12, md: 2.5}}>
            {profile &&
              <CardInfoManager
                data={profile}
              />
            }
            {profile &&
              <CardInfoStaff
                data={profile}
              />
            }
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffHome;
