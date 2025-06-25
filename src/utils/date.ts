import { Dayjs } from "dayjs";
import DateTime from "./DateTime";

export const getTime = (startDate: string | Dayjs| Date | null, completeDate: string | Dayjs| Date | null) : string => {
  const startHour = DateTime.FormatHour(startDate);
  const completeHour = DateTime.FormatHour(completeDate);
  return `${startHour} - ${completeHour}`
}
  
export const getMinutesDiff = (startDate: string | Dayjs| Date | null, completeDate: string | Dayjs| Date | null): number => {
  const start = DateTime.FormatHour(startDate);
  const complete = DateTime.FormatHour(completeDate);
  if(start && complete){
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = complete.split(':').map(Number);
    const startDate = new Date(0, 0, 0, startHour, startMinute);
    const endDate = new Date(0, 0, 0, endHour, endMinute);
    const diffMs = endDate.getTime() - startDate.getTime();
    return Math.floor(diffMs / 60000); // 60,000 ms = 1 phút
  }
  return 0;
}

// Hàm sinh ra tất cả ngày trong tháng
export const generateDaysOfMonth = (year: number, month: number): string[] => {
  const date = new Date(Date.UTC(year, month, 1));
  const days: string[] = [];
  while(date.getMonth() === month){
    days.push(date.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return days;
}

// Hàm trả ra thứ
export const getWeekDay = (dateStr : string) :  string => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long'}).format(date);
}

// Trả ra thời gian
export const extractMinutes = (text: string): number => {
  const num = parseInt(text.replace(/\D/g, ''), 10);
  return isNaN(num) ? 0 : num;
};

// Format date theo "dd/mm"
export const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}`
}