// src/utils/formatters.ts
export const formatIsoToLocalTime = (isoString: string | Date | null | undefined): string | null => {
  // 1. Kiểm tra đầu vào không hợp lệ (null, undefined, chuỗi rỗng)
  if (!isoString) {
    return null; // Trả về null để bên gọi có thể xử lý linh hoạt (ví dụ: hiển thị "Chưa bắt đầu")
  }

  try {
    // 2. Tạo đối tượng Date. new Date() có thể xử lý cả chuỗi ISO và đối tượng Date.
    const date = new Date(isoString);

    // 3. Kiểm tra xem đối tượng Date có hợp lệ không.
    // Nếu chuỗi đầu vào không phải là một ngày tháng hợp lệ, `getTime()` sẽ trả về NaN.
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string provided to formatIsoToLocalTime:", isoString);
      return null;
    }

    // 4. Định dạng thời gian sang múi giờ địa phương của trình duyệt, theo kiểu Việt Nam.
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit', // "09", "17"
      minute: '2-digit', // "05", "30"
      hour12: false, // Sử dụng định dạng 24 giờ
    });
  } catch (error) {
    // 5. Bắt các lỗi không mong muốn khác
    console.error("An unexpected error occurred in formatIsoToLocalTime:", error);
    return "Lỗi giờ"; // Trả về một chuỗi báo lỗi rõ ràng
  }
};