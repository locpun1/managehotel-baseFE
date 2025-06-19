import type { HttpResponse } from '@/types/common';
import { Floors, GroupTasks, Rooms, TaskData, Tasks } from '@/types/manager';
import HttpClient from '@/utils/HttpClient';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

export interface DataGroupTaskProps{
    result:{
      data: GroupTasks[],
      totalCount: number;   
      totalPages?: number;
      number?: number;
    }
}

export interface DataTaskProps{
    result:{
      data: Tasks[],
      totalCount: number;   
      totalPages?: number;
      number?: number;
    }
}

export interface DataRoomsProps{
    data: Rooms[],
    totalCount: number;   
    totalPages?: number;
    number?: number;
  
}

export type LinkRequest = {
  roomId: string | number;
};


export const getAllListFloor = () => {
  return HttpClient.get<HttpResponse<Floors>>(`${prefix}/floors/get-list-floors`);
};

export const getRoomByFloor = (floorId: string | number) => {
  const url = `${prefix}/rooms/get-list-floor/${floorId}/room`;
  return HttpClient.get<HttpResponse<Rooms>>(url); 
};

export const createTask =  (params: TaskData) => {
  return HttpClient.post<typeof params, HttpResponse<Tasks>>(`${prefix}/tasks/create-task`, params);
}

export const updateTask = async (
  groupTaskId: string | number,
  payload: TaskData
): Promise<HttpResponse<TaskData>> => {
  const url = `${prefix}/tasks/${groupTaskId}/update-task`; 
  return HttpClient.put<TaskData>(url, payload as any);
};

export const generateLink =  (params: LinkRequest) => {
  return HttpClient.post<typeof params, HttpResponse<Rooms>>(`${prefix}/rooms/generate-link`, params);
}

export const getListGroupTask = (
    page: number,
    size: number,
    dueDate?: string,
): Promise<HttpResponse<GroupTasks>> => {
    const endpoint = `${prefix}/tasks/list-group-task`;
    const params: Record<string, any> = {
        page: page,
        size: size,
        dueDate:dueDate
    }
    return HttpClient.get<HttpResponse<GroupTasks>>(endpoint,{params})
}
export const getTaskByGroupTask = (
    page: number,
    size: number,
    groupTaskId:number | string,
    dueDate?:string,
): Promise<HttpResponse<Tasks>> => {
    const endpoint = `${prefix}/tasks/list-task-by-group-task`;
    const params: Record<string, any> = {
        page: page,
        size: size,
        groupTaskId: groupTaskId,
        dueDate: dueDate
    }
    return HttpClient.get<HttpResponse<Tasks>>(endpoint,{params})
}  

export const getListRoom = (
  page: number,
  size: number,
  dueDate?: string,
): Promise<HttpResponse<Tasks>> => {
  const endpoint = `${prefix}/rooms/get-list-room`;
  const params: Record<string, any> = {
      page: page,
      size: size,
      dueDate:dueDate
  }
  return HttpClient.get<HttpResponse<Tasks>>(endpoint,{params})
} 

export const getRooms = (
  page: number,
  size: number,
): Promise<HttpResponse<Rooms>> => {
  const endpoint = `${prefix}/rooms/get-rooms`;
  const params: Record<string, any> = {
      page: page,
      size: size,
  }
  return HttpClient.get<HttpResponse<Rooms>>(endpoint,{params})
} 


