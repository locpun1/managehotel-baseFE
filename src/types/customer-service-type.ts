// ./customer-service-type.ts

export interface CustomerServiceType {
    id: number; 
    serviceId: number | string;
    serviceName?: string; 
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | string; 
    activationDate?: string;
    expiryDate?: string;
    // Thêm các thuộc tính khác liên quan đến việc sử dụng dịch vụ của khách hàng
  }
  
  // (Tùy chọn) Bạn cũng có thể định nghĩa các kiểu liên quan khác ở đây
  // Ví dụ: Kiểu để thêm dịch vụ cho khách hàng
  // export interface AddCustomerServiceRequest {
  //   customerId: number;
  //   serviceId: number | string;
  //   activationDate?: string;
  //   // ...
  // }