import { UserProfile } from "@/types/users";
import { generateDaysOfMonth } from "@/utils/date";
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { CleaningStat, DayCell } from "..";

interface TabCleaningDayAllStaffProps{
    listUsers: UserProfile[];
    cleaningStats: CleaningStat[];
    handleCellClick: (stat: DayCell, staffId: string | number, date: string) => void;
    from?: string;
    monthTabMonth?: number;
}

const TabCleaningDayAllStaff: React.FC<TabCleaningDayAllStaffProps> = (props) => {
    const {listUsers, cleaningStats, handleCellClick, from, monthTabMonth } = props;
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const days = from && monthTabMonth ? generateDaysOfMonth(year, monthTabMonth - 1) : generateDaysOfMonth(year, month);
    
    return(
        <Box sx={{ p:2}}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                🧹 Bảng thống kê dọn dẹp tháng {from ? monthTabMonth : month + 1}/{year}
            </Typography>
            <TableContainer
                component={Paper}
                sx={{
                borderRadius: 2,
                maxHeight: '70vh',
                overflowX: 'auto',
                boxShadow: 3,
                overflowY: 'auto',
                    '&::-webkit-scrollbar': { height: '6px' },
                    '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 },
                    '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    },
                }}
            >
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: '#00C7BE',
                                    minWidth: 150,
                                    height: "60px",
                                    position: 'sticky',
                                    left: 0,
                                    zIndex: 3
                                }}
                            >
                                Nhân viên/ Ngày
                            </TableCell>
                            {days.map((day) => (
                                <TableCell
                                key={day}
                                align="center"
                                sx={{
                                    fontWeight: 600,
                                    backgroundColor: '#00C7BE',
                                    minWidth: 100,
                                }}
                                >
                                {new Date(day).getDate()}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listUsers.map((staff) => (
                        <TableRow key={staff.id} hover>
                            <TableCell
                            sx={{
                                fontWeight: 500,
                                backgroundColor: '#f1f8e9',
                                height: "60px",
                                position: 'sticky',
                                left: 0,
                                zIndex: 3
                            }}
                            >
                                {staff.full_name}
                            </TableCell>
                            {days.map((day) => {
                            const stat = cleaningStats.find((s) => s.staffId === staff.id)?.stats[day];
                            return (
                                <TableCell
                                key={day}
                                onClick={() => stat && handleCellClick(stat, staff.id, day)}
                                sx={{
                                    cursor: stat ? 'pointer' : 'default',
                                    bgcolor: stat ? '#f9fbe7' : undefined,
                                    transition: '0.2s',
                                    '&:hover': stat && {
                                    backgroundColor: '#dcedc8',
                                    },
                                    minWidth: 120, maxWidth: 150
                                }}
                                >
                                {stat ? (
                                    <>
                                    🏨 {stat.roomCount} phòng
                                    <br />⏱️ {stat.totalMinutes} phút
                                    </>
                                ) : (
                                    <Typography align="center">{` - `}</Typography>
                                )}
                                </TableCell>
                            );
                            })}
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default TabCleaningDayAllStaff;