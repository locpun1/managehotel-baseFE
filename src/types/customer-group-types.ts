// ./customer-group-types.ts

export interface CustomerGroupType {
    id: number;
    name: string;
    description?: string; 
    // Thêm các thuộc tính khác nếu nhóm khách hàng của bạn có thêm thông tin
  }
  // export interface ListCustomerGroupsResponse {
  //   items: CustomerGroupType[];
  //   total: number;
  // }
  
  // Ví dụ: Kiểu dữ liệu khi tạo/cập nhật nhóm
  // export interface CreateCustomerGroupRequest {
  //   name: string;
  //   description?: string;
  // }
  
  // export interface UpdateCustomerGroupRequest {
  //   name?: string;
  //   description?: string;
  // }