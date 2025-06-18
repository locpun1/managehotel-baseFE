import { REPORT_LABELS, ReportStatus, STATUS_LABELS, TASK_REPORT_LABELS, TaskReportStatus, TaskStatus } from "@/constants/taskStatus";

export const getStatusLabel = (status: TaskStatus | null | undefined) : string => {
    if(!status) return "Chưa xác định";
    return STATUS_LABELS[status] || status
}

export const getStatusChipColor = (status: TaskStatus | null | undefined): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch(status){
        case TaskStatus.PENDING: return "primary";
        case TaskStatus.PROGRESS: return "warning";
        case TaskStatus.COMPLETED: return "success";
        case TaskStatus.CANCELLED: return "error";
        default: return "default";
    }
}

export const getReportTaskStatusLabel = (status: TaskReportStatus | null | undefined) : string => {
    if(!status) return "Chưa gửi";
    return TASK_REPORT_LABELS[status] || String(status);
}

export const getReportStatusLabel = (status: ReportStatus | null | undefined) : string => {
    if(!status) return "Chưa duyệt";
    return REPORT_LABELS[status] || status;
}