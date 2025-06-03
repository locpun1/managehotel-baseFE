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