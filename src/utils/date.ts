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