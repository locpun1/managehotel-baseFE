import { extractMinutes, formatDate, generateDaysOfMonth, getWeekDay } from "@/utils/date";
import { useEffect, useMemo, useState } from "react";
import { Avatar, Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { AccessTime, CalendarMonth, MeetingRoom } from "@mui/icons-material";
import { DailyCleaning, HomeStaffProps } from "..";

//Hàm kết hợp dữ liệu do API trả ra và lấp đầy ngày trống
const mergeCleaningDataWithEmptyDays = (year: number, month: number, cleaningData: DailyCleaning[]) : DailyCleaning[] => {
  const allDays = generateDaysOfMonth(year, month);
  return allDays.map((date) => {
    const found = cleaningData.find((item) => item.date === date);
    return {
      date,
      rooms: found?.rooms ?? []
    }
  })
}

const CleaningDaysCardMobile: React.FC<HomeStaffProps> = (props) => {
  const {cleaningHistory} = props;
  const [data, setData] = useState<DailyCleaning[]>([]);
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  useEffect(() => {
    const fullData = mergeCleaningDataWithEmptyDays(year, month, cleaningHistory);
    setData(fullData)
  },[year, month, cleaningHistory]);

  const totalMinutes = useMemo(() => {
    return data.reduce((sum, day) => {
      return sum + day.rooms.reduce((acc, room) => acc + extractMinutes(room.total), 0);
    }, 0);
  },[data])

  const totalRooms = useMemo(() => {
    return data.reduce((sum, day) => {
      return sum + day.rooms.length;
    }, 0);
  },[data])

  const dateToday = formatDate(new Date().toISOString().split('T')[0]);
  const todayStr = new Date().toISOString().split('T')[0];
  return (
    <Box 
      sx={{ 
        height: 'calc(100vh - 200px)', 
        overflowY: 'auto', p: 2,
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
        }, 
      }}
    >
      <Typography variant='h6' fontWeight={500} gutterBottom>
          {`🧹 Tháng ${month + 1}/${year} - 🕒 Tổng thời gian dọn: ${totalMinutes} phút -  🏨 ${totalRooms} phòng `}
      </Typography>
      <Grid container spacing={2}>
        {data.map((cleaningItem) => {
          const isToday = cleaningItem.date === todayStr
          return(
            <Grid size={{ xs: 12, md:3}}>
              <Card 
                key={cleaningItem.date}
                sx={{ 
                  borderRadius: 3, 
                  boxShadow: 3, 
                  backgroundColor: isToday ? '#E3F2FD' : '#f8f9fa',
                  border: isToday ? '2px solid #1976d2' : 'none', 
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1.5}>
                    <Avatar sx={{ bgcolor: "#00C7BE", mr: 2 }}>
                      <CalendarMonth />
                    </Avatar>
                    <Box>
                      {dateToday === formatDate(cleaningItem.date) ? (
                        <Typography variant="subtitle1" fontWeight={600}>
                          {`Ngày ${formatDate(cleaningItem.date)} - ${getWeekDay(cleaningItem.date)}`}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle1">
                          {`Ngày ${formatDate(cleaningItem.date)} - ${getWeekDay(cleaningItem.date)}`}
                        </Typography>
                      )}
                      <Typography variant="caption" color="text.secondary">
                        Phòng đã dọn
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 1}} />
                  {cleaningItem.rooms.length > 0 ? (
                    <Grid container spacing={1}>
                      {cleaningItem.rooms.map((room) => {
                        return (
                          <Grid size={{ xs: 12, md: 6}} key={room.id}>
                            <Box
                              display='flex'
                              justifyContent='start'
                              flexDirection='column'
                              sx={{
                                px: 2,
                                py: 1,
                                bgcolor: '#fff',
                                borderRadius: 2,
                                boxShadow: 1
                              }}
                            >
                              <Stack direction='row'>
                                <MeetingRoom sx={{ fontSize: 16, color: '#888', mr: 1}}/>
                                <Typography variant='body2' fontWeight={500}>{`Phòng ${room.room_number}`}</Typography>
                              </Stack>
                              <Stack direction='row'>
                                <AccessTime sx={{ fontSize: 16, color: '#888', mr: 1}}/>
                                <Typography variant='body2' fontWeight={500}>{`${room.total}`}</Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        )
                      })}
                    </Grid>
                  ) : (
                    <Box
                      sx={{
                          px: 2,
                          py: 1,
                          bgcolor: '#fff',
                          borderRadius: 2,
                          boxShadow: 1
                      }}
                    >
                      <Typography variant='body2'>Không có phòng nào được dọn trong ngày này</Typography>
                    </Box>
                    
                  )}
                </CardContent>
              </Card>
            </Grid>

          )
        })}
      </Grid>
    </Box>
  )
}

export default CleaningDaysCardMobile;
