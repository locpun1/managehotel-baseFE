import { HttpResponse } from "@/types/common";
import { ReportTask } from "@/types/report";
import HttpClient from "@/utils/HttpClient";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; 
const prefix = `${API_BASE_URL}/api/v1`;

export const sendReportTask = (
    FormData: FormData
) => {
    const endpoint = `${prefix}/reports/send-report-task`;
    return HttpClient.post<FormData, HttpResponse<ReportTask>>(endpoint, FormData);
}