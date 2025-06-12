// Có thể đặt ở file types.ts hoặc trực tiếp trong component nếu chỉ dùng ở đó
export interface TaskListDataItem {
    id: string | number;
    startTime?: string; // Ví dụ: "08:30", "00:00" nếu chưa bắt đầu
    durationText: string; // Ví dụ: "Trong 30 phút", "Khoảng 25 phút"
    title: string;
    status: 'Hoàn thành' | 'Hoạt động' | 'Chưa làm' | 'Đang chờ' | string; // 'Đang chờ' là trạng thái có icon play màu vàng
    // Thêm các trường khác nếu cần, ví dụ: isPriority, assignedTo, etc.
  }