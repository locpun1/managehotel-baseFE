import { HttpResponse } from "@/types/common";
import { ReportTask } from "@/types/report";
import HttpClient from "@/utils/HttpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

export interface ReportsApiResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  reports: ReportTask[]; 
}

export const sendReportTask = (
    FormData: FormData
) => {
    const endpoint = `${prefix}/reports/send-report-task`;
    return HttpClient.post<FormData, HttpResponse<ReportTask>>(endpoint, FormData);
}

export const getListReports = async(
    page: number = 0,
    size: number = 10,
    dueDate?: string,
    staffId?: string | number,
    roomId?: string | number,
): Promise<ReportsApiResponse> => {
    let url = `${prefix}/reports/get-list-reports?page=${page}&size=${size}&staffId=${staffId}&dueDate=${dueDate}`;
    if(roomId){{
        url += `&roomId=${roomId}`
    }}
    const response = await HttpClient.get<{
        success: boolean;
        message: string;
        data: ReportsApiResponse
    }>(url);

    if(response.data && response.success && response.data){
        return response.data;
    }else{
        throw new Error(response?.message || 'Failed to fetch list reports')
    }
}

export const approveReport = (reportId: string | number) => {
    return HttpClient.patch<any, HttpResponse<ReportTask | null>>(
        `${prefix}/reports/approve-report?id=${reportId}`
    )
}