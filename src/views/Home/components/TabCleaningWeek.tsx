import {addDays, format as formatDateFn} from 'date-fns';
import { DailyCleaning, HomeStaffProps, WeeklyCleaning } from '..';
import { extractMinutes, formatDate, getWeekDay } from '@/utils/date';
import { Avatar, Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AccessTime, CalendarMonth, MeetingRoom } from '@mui/icons-material';

const groupDaysIntoWeeks = (year: number, month: number,data: DailyCleaning[]): WeeklyCleaning[] => {
  const days: DailyCleaning[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  let current = new Date(firstDayOfMonth)

  while (current <= lastDayOfMonth) {
    const dateStr = current.toISOString().split("T")[0];
    const found = data.find(item => item.date === dateStr);
    days.push({
      date: dateStr,
      rooms: found?.rooms ?? [],
    });
    current = addDays(current, 1)
  }
  //Chia 7 ngày 1 tuần từ startOfWeek
  const weeks: WeeklyCleaning[] = [];
  let i =0;
  while(i < days.length){
    const weekDays = days.slice(i, i + 7);
    const start = weekDays[0].date;
    const end = weekDays[weekDays.length - 1].date;

    const totalMinutes = weekDays.reduce((sum, day) => {
      return (
        sum + day.rooms.reduce((acc, room) => acc + extractMinutes(room.total),0)
      );
    },0)
    weeks.push({
      weekLabel: `Tuần ${weeks.length + 1}: ${formatDateFn(new Date(start), 'dd/MM')} - ${formatDateFn(new Date(end), 'dd/MM')}`,
      days: weekDays,
      totalMinutes
    });
    i +=7;
  }

  return weeks;
};
const CleaningWeeklyCardMobile: React.FC<HomeStaffProps> = ({ cleaningHistory }) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth(); // từ 0 → 11

  const weeks = groupDaysIntoWeeks(year, month,cleaningHistory);
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
      {weeks.map((week, index) => (
        <Box key={index} mb={3}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            {week.weekLabel} -  🕒 Tổng thời gian: {week.totalMinutes} phút
          </Typography>
          <Grid container spacing={2}>
            {week.days.map((cleaningItem) => {
              const isToday = cleaningItem.date === todayStr
              return (
                <Grid size={{ xs:12, md:3 }} key={cleaningItem.date}>
                  <Card 
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
                          <Typography variant="subtitle1" fontWeight={dateToday === formatDate(cleaningItem.date) ? 600 : 400}>
                            {`Ngày ${formatDate(cleaningItem.date)} - ${getWeekDay(cleaningItem.date)}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Phòng đã dọn
                          </Typography>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 1 }} />
                      {cleaningItem.rooms.length > 0 ? (
                        <Grid container spacing={1}>
                          {cleaningItem.rooms.map((room) => (
                            <Grid size={{ xs:12, md:6 }} key={room.id}>
                              <Box
                                display='flex'
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
                                  <MeetingRoom sx={{ fontSize: 16, color: '#888', mr: 1 }} />
                                  <Typography variant='body2' fontWeight={500}>{`Phòng ${room.room_number}`}</Typography>
                                </Stack>
                                <Stack direction='row'>
                                  <AccessTime sx={{ fontSize: 16, color: '#888', mr: 1 }} />
                                  <Typography variant='body2' fontWeight={500}>{`${room.total}`}</Typography>
                                </Stack>
                              </Box>
                            </Grid>
                          ))}
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
      ))}
    </Box>
  );
};

export default CleaningWeeklyCardMobile;