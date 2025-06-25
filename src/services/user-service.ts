import type { HttpResponse } from '@/types/common';
import { GroupTasks } from '@/types/manager';
import { UserProfile } from '@/types/users';
import HttpClient from '@/utils/HttpClient';
import { DailyCleaning } from '@/views/Home';
import { CleaningStat } from '@/views/Manager/ManagementTimekeepings';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

export interface CheckoutApiResponse {
  message: string;
  success: boolean;
  data: GroupTasks; 
}

export interface CheckoutApiUserResponse {
  message: string;
  success: boolean;
  data: UserProfile; 
}

interface RecordsResponse {
  isCheckout: number;
  roomId: number | string;
  totalMinutes: number; 
}

export interface UserAttachedRoom{
  id: string|number,
  fullName: string,
  records: RecordsResponse[]
}

export const getUserAttachedRoomAndTask = async(
  dateToday?:string,
) : Promise<UserAttachedRoom> => {
  let url = `${prefix}/users/get-list-user-attached-room-and-task?dateToday=${dateToday}`;
      const response = await HttpClient.get<{
        success:boolean;
        message: string;
        data: UserAttachedRoom;
    }>(url);
    if (response.data && response.success && response.data) {
      return response.data; 
    } else {
      console.error("API response error in getProfileUserCreateTaskAttachedRoom:", response);
      throw new Error(response?.message || 'Failed to fetch profle user');
    }
}

export const getRoomAndTaskDoneByStaff = async(
  staffId?:string | number,
) : Promise<DailyCleaning> => {
  let url = `${prefix}/users/get-room-and-task-done-by-staff?staffId=${staffId}`;
      const response = await HttpClient.get<{
        success:boolean;
        message: string;
        data: DailyCleaning;
    }>(url);
    if (response.data && response.success && response.data) {
      return response.data; 
    } else {
      console.error("API response error in getRoomAndTaskDoneByStaff:", response);
      throw new Error(response?.message || 'Failed to fetch profle user');
    }
}

export const getCurrentUser = () => {
  return HttpClient.get<HttpResponse<UserProfile>>(`${prefix}/auth/me`);
};

export const updateUserProfile = (
  id: string | number | null,
  formData: FormData
) => {
  const endpoint = `${prefix}/users/update-profile/${id}`;
  return HttpClient.post<FormData, HttpResponse<UserProfile>>(endpoint, formData);
};

export const getProfileUserCreateTaskAttachedRoom = async(
  roomId: string,
): Promise<UserProfile> => {
    let url = `${prefix}/users/profile-user?roomId=${roomId}`;
    const response = await HttpClient.get<{
        success:boolean;
        message: string;
        data: UserProfile;
    }>(url);
    if (response.data && response.success && response.data) {
      return response.data; 
    } else {
      console.error("API response error in getProfileUserCreateTaskAttachedRoom:", response);
      throw new Error(response?.message || 'Failed to fetch profle user');
    }
}

export const checkout = (roomId: string | number, date: string) => {
    return HttpClient.patch<any, HttpResponse<GroupTasks | null>>(
        `${prefix}/users/check-out?roomId=${roomId}&date=${date}`
    )
}

export const getListUser = async (
  page: number = 0,
  size: number = 99 // Số lượng task mỗi trang, có thể điều chỉnh
): Promise<CheckoutApiUserResponse> => { // Hàm này trả về trực tiếp object data từ response API
  let url = `${prefix}/users/get-list-user?page=${page}&size=${size}`;

  const response = await HttpClient.get<{ // Kiểu của toàn bộ body JSON từ backend
    success: boolean;
    message: string;
    data: CheckoutApiUserResponse; // data từ backend chính là CheckoutApiUserResponse
  }>(url);

  if (response.data && response.success && response.data) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Failed to fetch list user');
  }
};

export const getTotalRoomAndMinutesDoneByStaff = async (
  month: number,
  year: number
): Promise<CleaningStat> => { // Hàm này trả về trực tiếp object data từ response API
  let url = `${prefix}/users/get-total-rooms-and-minutes-done-staff?month=${month}&year=${year}`;

  const response = await HttpClient.get<{ // Kiểu của toàn bộ body JSON từ backend
    success: boolean;
    message: string;
    data: CleaningStat; // data từ backend chính là CheckoutApiUserResponse
  }>(url);

  if (response.data && response.success && response.data) {
    return response.data;
  } else {
    throw new Error(response?.message || 'Failed to fetch list user');
  }
};
