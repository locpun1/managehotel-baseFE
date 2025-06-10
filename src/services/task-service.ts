// src/services/task.service.ts
import { HttpResponse } from '@/types/common';
import { TaskItemData } from '@/types/task-types';
import HttpClient from '@/utils/HttpClient';
import { TaskListAction } from '@/views/DisplayRemote/components/TaskList';
import type { StepProps } from '@/views/DisplayRemote/components/TaskProgressStepper';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const prefix = `${API_BASE_URL}/api/v1/tasks`;
const adminTaskPrefix = `${API_BASE_URL}/api/v1/tasks/admin`;

export interface StepperDataPayload {
  roomNumber: string;
  taskTitlePrefix?: string;
  status: 'Chưa làm' | 'Hoạt động' | 'Hoàn thành' | string;
  currentDate: string;
  steps?: StepProps[];
}

export interface DetailedTasksApiResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  tasks: TaskItemData[]; // Mảng các task mà TaskList sẽ dùng
  // Có thể thêm title hoặc roomInfo nếu API trả về ở cấp này
  // title?: string;
  // roomInfo?: { id: string; number: string; floorName: string; };
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: StepperDataPayload;
}

export interface UpdateTaskPayload {
  status?: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'waiting';
  action?: TaskListAction 
}

export const getRoomProcessSteps = async (
  roomId: string,
  date?: string
): Promise<StepperDataPayload> => { 
  let url = `${prefix}/rooms/${roomId}/process-steps`;
  if (date) {
    url += `?date=${date}`;
  }

  const response = await HttpClient.get<ApiResponse>(url);

  if (response && response.success && response.data) {
      return response.data;
  } else {
      const errorMessage = response?.message || (response as any)?.message || 'Failed to fetch room process steps or invalid data structure';
      throw new Error(errorMessage);
  }
};

export const getRoomDetailedDailyTasks = async (
  roomId: string,
  date?: string, // YYYY-MM-DD
  page: number = 0,
  size: number = 20 // Số lượng task mỗi trang, có thể điều chỉnh
): Promise<DetailedTasksApiResponse> => { // Hàm này trả về trực tiếp object data từ response API
  let url = `${prefix}/rooms/${roomId}/detailed-daily-tasks?page=${page}&size=${size}`;
  if (date) {
    url += `&date=${date}`;
  }

  const response = await HttpClient.get<{ // Kiểu của toàn bộ body JSON từ backend
      success: boolean;
      message: string;
      data: DetailedTasksApiResponse; // data từ backend chính là DetailedTasksApiResponse
  }>(url);

  if (response.data && response.success && response.data) {
      return response.data; 
  } else {
      throw new Error(response?.message || 'Failed to fetch detailed daily tasks');
  }
};

export const triggerDailyTaskRollover = async (): Promise<HttpResponse<any>> => { 
  const url = `${adminTaskPrefix}/trigger-rollover`;
  return HttpClient.post<any>(url, {});
};

export const triggerDeleteOldTasks = async (daysToKeep?: number): Promise<HttpResponse<any>> => {
  const url = `${adminTaskPrefix}/trigger-delete-old`;
  const body = daysToKeep ? { daysToKeep } : {};
  return HttpClient.post<any>(url, body);
};

export const updateTaskStatusAPI = async (
  taskId: string | number,
  payload: UpdateTaskPayload
): Promise<HttpResponse<TaskItemData>> => {
  const url = `${prefix}/${taskId}/status`; 
  return HttpClient.patch<TaskItemData>(url, payload as any);
};