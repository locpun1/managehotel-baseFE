// src/services/customer-group-service.ts

import { Endpoints } from '@/constants/endpoints'; 
import type { HttpResponse, QueryPayloadType } from '@/types/common';
import type { CustomerGroupType } from '@/types/customer-group-types';
import HttpClient from '@/utils/HttpClient'; 

export interface ListCustomerGroupsResponse {
  items: CustomerGroupType[];
  total: number;
  page?: number; // Tùy chọn, dựa vào API của bạn
  limit?: number; // Tùy chọn, dựa vào API của bạn
}

export const getCustomerGroups = (body: QueryPayloadType) => {
  return HttpClient.post<QueryPayloadType, HttpResponse<ListCustomerGroupsResponse>>(
    Endpoints.customerGroups.search,
    body,
  );

};

// (Tùy chọn) Thêm các hàm service khác cho customer group nếu cần sau này:
/*
export const getCustomerGroupById = (id: number | string) => {
  return HttpClient.get<null, HttpResponse<CustomerGroupType>>(
    prepareRealPath(Endpoints.customerGroup.detail, { id }) // Ví dụ endpoint detail
  );
};

export const createCustomerGroup = (data: Partial<CustomerGroupType>) => {
  return HttpClient.post<Partial<CustomerGroupType>, HttpResponse<CustomerGroupType>>(
     Endpoints.customerGroup.create, // Ví dụ endpoint create
     data
   );
};

export const updateCustomerGroup = (id: number | string, data: Partial<CustomerGroupType>) => {
   return HttpClient.put<Partial<CustomerGroupType>, HttpResponse<CustomerGroupType>>(
     prepareRealPath(Endpoints.customerGroup.update, { id }), // Ví dụ endpoint update
     data
   );
};

export const deleteCustomerGroup = (id: number | string) => {
   return HttpClient.delete(
     prepareRealPath(Endpoints.customerGroup.delete, { id }) // Ví dụ endpoint delete
   );
};
*/