import { Endpoints } from '@/constants/endpoints';
import type { HttpResponse } from '@/types/common';
import { Floors, Rooms, TaskData, Tasks } from '@/types/manager';
import HttpClient from '@/utils/HttpClient';
import { prepareRealPath } from '@/utils/url';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}`;

export const getAllListFloor = () => {
  return HttpClient.get<HttpResponse<Floors>>(`${prefix}/floors/get-list-floors`);
};

export const getRoomByFloor = (floorId: string | number) => {
  const url = prepareRealPath(Endpoints.manager.getRoomByFloor, { floorId });
  
  return HttpClient.get<HttpResponse<Rooms>>(url)
}

export const createTask =  (params: TaskData) => {
  return HttpClient.post<typeof params, HttpResponse<Tasks>>(`${prefix}/tasks/create-task`, params);
}
