export const TaskStatus = {
    PENDING : 'pending',           
    PROGRESS :'in_progress',        
    COMPLETED : 'completed',           
    CANCELLED : 'cancelled',               
}

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export const STATUS_LABELS: { [key in TaskStatus]: string} = {
    [TaskStatus.PENDING]: "Chưa làm",
    [TaskStatus.PROGRESS]: "Hoạt đông",
    [TaskStatus.COMPLETED]: "Hoàn thành",
    [TaskStatus.CANCELLED]: "Hủy",
}

export const RoleUser = {
    MANAGER : 'manager',           
    STAFF : 'staff',                      
}

export type RoleUser = typeof RoleUser[keyof typeof RoleUser];

export const ROLE_LABELS: { [key in RoleUser]: string} = {
    [RoleUser.MANAGER]: "Quản lý nhân sự",
    [RoleUser.STAFF]: "Nhân viên"
}

export const ReportStatus = {
    NEW: 'new',
    SEEN: 'seen',
    RESOLVED: "resolved",
}

export type ReportStatus = typeof ReportStatus[keyof typeof ReportStatus];

export const REPORT_LABELS: { [key in ReportStatus]: string} = {
    [ReportStatus.NEW]: "Chờ duyệt",
    [ReportStatus.SEEN]: "Đã xem",
    [ReportStatus.RESOLVED]: "Đã duyệt"
}

export enum TaskReportStatus {
    REPORTED = 1,           
    UNREPORTED = 0,             
}

export const TASK_REPORT_LABELS: { [key in TaskReportStatus]: string} = {
    [TaskReportStatus.REPORTED]: "Đã gửi",
    [TaskReportStatus.UNREPORTED]: "Chưa gửi"
}