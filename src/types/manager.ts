import { TaskStatus } from "@/constants/taskStatus";

export interface Floors{
    id: string | number,
    floor_number: number,
    name: string,
    createdAt: string,
    updatedAt: string
}

export interface Rooms{
    id: string | number,
    room_number: number,
    floor_id: string | number,
    description: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    floorName?:string,
    link_web: string,
    taskName: string,
    due_date: string,
    started_at: string,
    completed_at: string,
    statusTask: TaskStatus,
    idGroupTask: string | number
}

interface TaskItemData {
    title: string,
    order_in_process: number,
    status: TaskStatus,
    due_date:string,
}

export interface TaskData {
    name: string;
    notes: string;
    quantity: number;
    status: string,
    assigned_by_id: number | string,
    room_id: number | string,
    due_date:string,
    groupTask: TaskItemData[]
}

export interface Tasks {
    id: string | number;
    room_id: number;
    assigned_by_id: number,
    assigned_to_id?: number,
    title: string,
    quantity: number;
    qr_code_identifier?: string,
    qr_code_url?: string,
    status: TaskStatus,
    notes: string,
    due_date: string,
    started_at?: string,
    completed_at?: string,
    createdAt?:string,
    updatedAt?:string,
    roomName?:string,
    floorName?:string,
    order_in_process: number
}

export interface GroupTasks {
    id: string | number;
    room_id: number;
    assigned_by_id: number,
    assigned_to_id?: number,
    name: string,
    quantity: number;
    qr_code_url?: string,
    status: TaskStatus,
    notes: string,
    due_date: string,
    started_at?: string,
    completed_at?: string,
    createdAt?:string,
    updatedAt?:string,
    roomName?:string,
    floorName?:string,
    groupTask: Tasks[],
    floor_id: number,
}