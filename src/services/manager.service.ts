import { Endpoints } from '@/constants/endpoints';
import type { HttpResponse } from '@/types/common';
import { Floors, Rooms, TaskData, Tasks } from '@/types/manager';
import HttpClient from '@/utils/HttpClient';
import { prepareRealPath } from '@/utils/url';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

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

export const getAllListFloor = () => {
  return HttpClient.get<HttpResponse<Floors>>(`${prefix}/floors/get-list-floors`);
};

export const getRoomByFloor = (floorId: string | number) => {
  const url = `${prefix}/get-list-floor/${floorId}/room`;
  return HttpClient.get<HttpResponse<Rooms>>(url); 
};

export const createTask =  (params: TaskData) => {
  return HttpClient.post<typeof params, HttpResponse<Tasks>>(`${prefix}/tasks/create-task`, params);
}

export const getListTask = (
    page: number,
    size: number,
    roomId?:number | string
): Promise<HttpResponse<Tasks>> => {
    const endpoint = `${prefix}/tasks/list-task`;
    const params: Record<string, any> = {
        page: page,
        size: size,
        roomId: roomId
    }
    return HttpClient.get<HttpResponse<Tasks>>(endpoint,{params})
} 

export const getListRoom = (
  page: number,
  size: number,
): Promise<HttpResponse<Tasks>> => {
  const endpoint = `${prefix}/rooms/get-list-room`;
  const params: Record<string, any> = {
      page: page,
      size: size,
  }
  return HttpClient.get<HttpResponse<Tasks>>(endpoint,{params})
} 


