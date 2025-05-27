export enum TaskStatus {
    PENDING = 'pending',           
    PROGRESS = 'in_progress',        
    COMPLETED = 'completed',           
    CANCELLED = 'cancelled',               
}

export const STATUS_LABELS: { [key in TaskStatus]: string} = {
    [TaskStatus.PENDING]: "Chưa làm",
    [TaskStatus.PROGRESS]: "Hoạt đông",
    [TaskStatus.COMPLETED]: "Hoàn thành",
    [TaskStatus.CANCELLED]: "Hủy",
}