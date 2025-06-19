import type { HttpResponse } from '@/types/common';
import { GroupTasks } from '@/types/manager';
import { UserProfile } from '@/types/users';
import HttpClient from '@/utils/HttpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

export interface CheckoutApiResponse {
  message: string;
  success: boolean;
  data: GroupTasks; 
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
