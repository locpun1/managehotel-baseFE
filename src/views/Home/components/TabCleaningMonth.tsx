import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { CalendarMonth, AccessTime, MeetingRoom } from "@mui/icons-material";
import { DailyCleaning } from "..";

type MonthlyStats = {
  month: number; // 0 - 11
  roomCount: number;
  totalMinutes: number;
};

const getMonthlyStats = (data: DailyCleaning[]): MonthlyStats[] => {
  const result: Record<number, { roomCount: number; totalMinutes: number }> = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const month = date.getMonth();

    const roomCount = item.rooms.length;
    const totalMinutes = item.rooms.reduce((sum, r) => {
      const mins = parseInt(r.total.replace(/\D/g, '')) || 0;
      return sum + mins;
    }, 0);

    if (!result[month]) {
      result[month] = { roomCount: 0, totalMinutes: 0 };
    }

    result[month].roomCount += roomCount;
    result[month].totalMinutes += totalMinutes;
  });

  // Trả ra đầy đủ 12 tháng (kể cả không có data)
  return Array.from({ length: 12 }, (_, i) => ({
    month: i,
    roomCount: result[i]?.roomCount || 0,
    totalMinutes: result[i]?.totalMinutes || 0,
  }));
};

interface Props {
  data: DailyCleaning[];
}

const CleaningByMonthCardMobile: React.FC<Props> = ({ data }) => {
  const stats = getMonthlyStats(data);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        🧹 Thống kê dọn dẹp theo từng tháng
      </Typography>
      <Grid container spacing={2}>
        {stats.map(({ month, roomCount, totalMinutes }) => (
          <Grid item xs={12} md={4} key={month}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#f9f9f9' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={1}>
                  <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    Tháng {month + 1}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <MeetingRoom sx={{ fontSize: 18, mr: 1, color: '#888' }} />
                  <Typography variant="body2">{roomCount} phòng đã dọn</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTime sx={{ fontSize: 18, mr: 1, color: '#888' }} />
                  <Typography variant="body2">{totalMinutes} phút</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CleaningByMonthCardMobile;
