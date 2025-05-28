// src/views/Manager/ManagementDisplayRemote/index.tsx

import Button from "@/components/Button/Button";
import { Box, Chip, Grid, Paper, TextField, Typography } from "@mui/material";

// Dữ liệu mẫu cho các TV (bạn sẽ thay thế bằng dữ liệu thật sau này)
const tvDisplayData = [
  {
    id: 'tv1',
    roomNumber: 'Phòng 201',
    floor: 'Tầng 2',
    isOnline: true,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
  {
    id: 'tv2',
    roomNumber: 'Phòng 202',
    floor: 'Tầng 2',
    isOnline: false,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
  {
    id: 'tv3',
    roomNumber: 'Phòng 203',
    floor: 'Tầng 2',
    isOnline: true,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
  {
    id: 'tv4',
    roomNumber: 'Phòng 204',
    floor: 'Tầng 2',
    isOnline: false,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
  {
    id: 'tv5',
    roomNumber: 'Phòng 205',
    floor: 'Tầng 2',
    isOnline: true,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
  {
    id: 'tv6',
    roomNumber: 'Phòng 206',
    floor: 'Tầng 2',
    isOnline: false,
    displayUrl: 'http://docs.google.com/spreadsheet/1/Ghahiupdndnhjdhd',
  },
];

interface TVControlCardProps {
  data: {
    roomNumber: string;
    floor: string;
    isOnline: boolean;
    displayUrl: string;
  };
}

function TVControlCard({ data }: TVControlCardProps) {
  const { roomNumber, floor, isOnline, displayUrl } = data;

  return (
    <Paper elevation={2} sx={{ padding: 2, borderRadius: '8px', border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box>
          <Typography variant="body2" component="span">Số phòng: </Typography>
          <Typography variant="body2" component="span" fontWeight="bold">{roomNumber}</Typography>
        </Box>
        <Chip
          label={isOnline ? 'Online' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" component="span">Số tầng: </Typography>
        <Typography variant="body2" component="span" fontWeight="bold">{floor}</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" component="span">Hiển thị: </Typography>
        <Typography
          variant="body2"
          component="a" // Để có thể click nếu muốn (thêm href)
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            wordBreak: 'break-all', // Để URL dài không làm vỡ layout
            display: 'inline',
          }}
        >
          {displayUrl}
        </Typography>
      </Box>

      <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
        Link URL
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="URL mới"
        size="small"
        sx={{ mb: 2 }}
        // value={newUrl} // Sẽ dùng state khi làm động
        // onChange={(e) => setNewUrl(e.target.value)} // Sẽ dùng state khi làm động
      />
      <Button
        customVariant="secondary"
        height={'40px'}
        width={'100%'}
        border='2px solid #00C7BE'
        fontColor='#00C7BE'
        fontWeight="600"
        // onClick={handleSubmit} // Sẽ dùng khi làm động
      >
        Gửi tới TV
      </Button>
    </Paper>
  );
}


function ManagementDisplayRemote() {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Quản lý Display Remote
      </Typography>
      <Grid container spacing={3}>
        {tvDisplayData.map((tv) => (
          <Grid item xs={12} sm={6} md={4} key={tv.id}>
            <TVControlCard data={tv} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ManagementDisplayRemote;