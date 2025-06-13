import { ReportStatus } from "@/constants/taskStatus";

export interface ReportTask{
    id: string | number,
    room_id: string | number,
    reported_by_id: string | number,
    task_id: string | number,
    title: string | number,
    description?: string,
    image_url?: string,
    createdAt:string,
    updatedAt: string,
    status: ReportStatus,
}