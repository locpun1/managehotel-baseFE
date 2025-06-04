export const TASK_STATUS_API = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    WAITING: 'waiting',
  } as const; // 'as const' giúp TypeScript hiểu các giá trị này là hằng số (literal types)
  
  export const TASK_STATUS_LABEL = {
    [TASK_STATUS_API.PENDING]: 'Chưa làm',
    [TASK_STATUS_API.IN_PROGRESS]: 'Hoạt động',
    [TASK_STATUS_API.COMPLETED]: 'Hoàn thành',
    [TASK_STATUS_API.CANCELLED]: 'Đã hủy',
    [TASK_STATUS_API.WAITING]: 'Đang chờ',
    // Các nhãn khác
  } as const;
  
  export type ApiTaskStatus = typeof TASK_STATUS_API[keyof typeof TASK_STATUS_API];
  
  export type DisplayTaskStatus = typeof TASK_STATUS_LABEL[keyof typeof TASK_STATUS_LABEL];
  
  export const TASK_ACTIONS = {
    TOGGLE_STATUS: 'toggleStatus',
    CANCEL: 'cancel',
    START: 'start',
    COMPLETED:'completed'
  } as const;
  
  export type TaskActionKey = typeof TASK_ACTIONS[keyof typeof TASK_ACTIONS];