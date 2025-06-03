import { Dayjs } from "dayjs";

export interface UserProfile{
    id: string | number,
    username: string,
    full_name: string,
    role: string,
    avatar_url?: string,
    phone_number: string,
    employee_code: string,
    createdAt:string,
    updatedAt: string,
    sex: string,
    date_of_birth: Dayjs | null,
    position?: string,
    address_work: string,
    email: string,
    address: string
}