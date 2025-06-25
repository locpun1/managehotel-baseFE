import { Box, Card, CardContent, Typography } from "@mui/material";
import React, { useState } from "react";
import { CleaningStat } from "..";
import Grid from '@mui/material/Grid2';
import { AccessTime, CalendarMonth, MeetingRoom } from "@mui/icons-material";
import FullScreenDialogCleaningDayAndWeekAllStaff from "./FullScreenDialogCleaningDayAndWeekAllStaff";

interface TabCleaningMonthAllStaffProps{
    cleaningStats: CleaningStat[];
    // handleCellClick: (stat: DayCell, staffId: string | number, date: string) => void;
}

interface MonthlyStats{
    month: number,
    roomCount: number,
    totalMinutes: number;
}

const getMonthlyStats = (data: CleaningStat[]) : MonthlyStats[] => {
    const result: Record<number, {roomCount: number; totalMinutes: number}> = {};
    data.forEach((item) => {
        const stats = item.stats;
        for(const dateStr in stats){
            const { roomCount, totalMinutes} = stats[dateStr];
            const date = new Date(dateStr);
            const month = date.getMonth();

            if(!result[month]){
                result[month] = { roomCount: 0, totalMinutes: 0};
            }

            result[month].roomCount += roomCount;
            result[month].totalMinutes += totalMinutes;
        }
    });
    // Trả ra đầy đủ 12 tháng (kể cả không có data)
    return Array.from({ length: 12 }, (_, i) => ({
        month: i,
        roomCount: result[i]?.roomCount || 0,
        totalMinutes: result[i]?.totalMinutes || 0,
    }));
}

const TabCleaningMonthAllStaff: React.FC<TabCleaningMonthAllStaffProps> = (props) => {
    const {cleaningStats } = props;
    const stats = getMonthlyStats(cleaningStats);
    const year = new Date().getFullYear();
    const [openFullScreenDialog, setFullScreenDialog] = useState(false);
    const [month, setMonth] = useState(0);


    const handleClick = (month: number) => {
        setMonth(month)
        setFullScreenDialog(true)
    }
    return(
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
            <Typography variant="h6" fontWeight={600} mb={2}>
            {`🧹 Thống kê dọn dẹp theo từng tháng năm ${year}`}
            </Typography>
            <Grid container spacing={2}>
                {stats.map((item) => {
                    return(
                        <Grid size={{ xs: 12, md: 4}} key={item.month}>
                            <Card sx={{ borderRadius: 3, boxShadow: 3, bgcolor: '#f9f9f9'}} onClick={() => handleClick(item.month + 1)}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <CalendarMonth sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Tháng {item.month + 1}
                                        </Typography>
                                    </Box> 
                                    <Box display="flex" alignItems="center" mb={0.5}>
                                        <MeetingRoom sx={{ fontSize: 18, mr: 1, color: '#888' }} />
                                        <Typography variant="body2">{item.roomCount} phòng đã dọn</Typography>
                                    </Box>
                                    <Box display="flex" alignItems="center">
                                        <AccessTime sx={{ fontSize: 18, mr: 1, color: '#888' }} />
                                        <Typography variant="body2">{item.totalMinutes} phút</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                })}
            </Grid>
            {openFullScreenDialog && (
                <FullScreenDialogCleaningDayAndWeekAllStaff
                    open={openFullScreenDialog}
                    onClose={() => {
                        setFullScreenDialog(false)
                    }}
                    title={`Thống kê dọn dẹp tháng ${month}/${year}`}
                    from="from-cleaning-month"
                    month={month}
                    year={year}
                />
            )}
        </Box>
    )
}

export default TabCleaningMonthAllStaff;