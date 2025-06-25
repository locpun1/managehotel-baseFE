import { UserProfile } from "@/types/users";
import { generateDaysOfMonth } from "@/utils/date";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { CleaningStat, DayCell } from "..";
import DateTime from "@/utils/DateTime";

interface TabCleaningWeekAllStaffProps{
    listUsers: UserProfile[];
    cleaningStats: CleaningStat[];
    handleCellClick: (stat: DayCell, staffId: string | number, date: string) => void;
    from?: string;
    monthTabMonth?: number;
}
const groupDaysByWeek = (days: string[]) => {
  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i ++) {
    const day = days[i];
    const date = new Date(day);
    const dayOfMonth = date.getDate(); //từ 1- 31
    const weekIndex = Math.floor((dayOfMonth - 1)/7);

    if(!weeks[weekIndex]){
      weeks[weekIndex] = []
    }
    weeks[weekIndex].push(day);
  }
  return weeks;
};

const TabCleaningWeekAllStaff: React.FC<TabCleaningWeekAllStaffProps> = (props) => {
    const {listUsers, cleaningStats, handleCellClick, from, monthTabMonth } = props;
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const days = from && monthTabMonth ? generateDaysOfMonth(year, monthTabMonth - 1) : generateDaysOfMonth(year, month);
    const weeks = groupDaysByWeek(days); // chia thành tuần
    
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
            {weeks.map((weekDays, index) => (
            <TableContainer component={Paper} sx={{ mb: 4 }} key={index}>
            <Typography variant="h6" sx={{ p: 2 }} fontWeight={500}>
                Tuần {index + 1} (Ngày {DateTime.FormatDate(weekDays[0])} – {DateTime.FormatDate(weekDays[weekDays.length - 1])})
            </Typography>
            <Table>
                <TableHead sx={{ backgroundColor: "#00c0c0" }}>
                <TableRow>
                    <TableCell 
                    sx={{
                        fontWeight: 500,
                        backgroundColor: '#00C7BE',
                        height: "60px",
                    }}
                    >
                        Nhân viên / Ngày
                    </TableCell>
                    {weekDays.map((day) => (
                    <TableCell sx={{ backgroundColor: '#00C7BE'}} align="center" key={day}>
                        {new Date(day).getDate()}
                    </TableCell>
                    ))}
                </TableRow>
                </TableHead>
                <TableBody>
                {listUsers.map((staff, idx) => (
                    <TableRow key={idx}>
                    <TableCell sx={{ backgroundColor: "#f1f8e9", fontWeight: 500, height: "60px" }}>{staff.full_name}</TableCell>
                    {weekDays.map((day) => {
                        const stat = cleaningStats.find((s) => s.staffId === staff.id)?.stats[day];
                        return (
                        <TableCell
                        align="center" key={day}
                        onClick={() => stat && handleCellClick(stat, staff.id, day)}
                        sx={{
                            cursor: stat ? 'pointer' : 'default',
                            bgcolor: stat ? '#f9fbe7' : undefined,
                            transition: '0.2s',
                            '&:hover': stat && {
                            backgroundColor: '#dcedc8',
                            },
                        }}
                        >
                        {stat ? (
                            <>
                            🏨 {stat.roomCount} phòng
                            <br />⏱️ {stat.totalMinutes} phút
                            </>
                        ) : (
                            '-'
                        )}
                        </TableCell>
                    )
                    })}
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
        ))}
        </Box>
    )
}

export default TabCleaningWeekAllStaff;