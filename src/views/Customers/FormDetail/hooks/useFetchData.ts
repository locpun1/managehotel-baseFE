import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router';

import useNotification from '@/hooks/useNotification';
import useTableFilters from '@/hooks/useTableFilters';
import { getCustomerGroups } from '@/services/customer-group-service';
import {
  getCustomerAddresses,
  getCustomerById,
  getCustomerContacts,
} from '@/services/customer-service';
import { setCustomerAddress } from '@/slices/customer-address-slice';
import { fetchCustomerGroups } from '@/slices/customer-group-slice';
import {
  setCustomersContact,
  setLoadingCustomer,
} from '@/slices/customer-slice';
import { useAppDispatch } from '@/store';

interface IProps {
  form: UseFormReturn<any>;
}

const useFetchData = ({ form }: IProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const notify = useNotification();
  const { filters, onChangeFilter } = useTableFilters();

  const fetchCustomer = useCallback(async () => {
    if (id) {
      const numericId = Number(id);

      if (isNaN(numericId)) {
        console.error('Invalid customer ID in URL:', id);
        notify({ message: 'Mã khách hàng không hợp lệ', severity: 'error' });
        return;
      }

      try {
        dispatch(setLoadingCustomer(true));
        const response = await getCustomerById(numericId);
        const data = response.data; 

        if (data) {
          form.reset({
            name: data.name,
            customerType: data.customerType,
            customerGroupId: data.customerGroup?.id || null, 
          });

          // (Tùy chọn) Lưu chi tiết khách hàng vào customerSlice nếu cần
          // dispatch(setCurrentCustomerDetail(data));

          // Dispatch actions để cập nhật các slice khác với dữ liệu liên quan
          // Cung cấp mảng rỗng mặc định nếu customerContacts/customerAddresses là null/undefined
          dispatch(setCustomersContact(data.customerContacts || []));
          dispatch(setCustomerAddress(data.customerAddresses || []));

        } else {
          console.error('Customer not found for ID:', numericId);
          notify({ message: 'Không tìm thấy khách hàng', severity: 'warning' });
          // Có thể bạn muốn reset form về trạng thái rỗng ở đây
          // form.reset({});
        }
      } catch (error: any) {
        console.error('Failed to fetch customer details:', error);
        notify({
          message: error?.message || 'Lỗi khi tải thông tin khách hàng',
          severity: 'error',
        });
      } finally {
        dispatch(setLoadingCustomer(false));
      }
    } else {
      // Xử lý trường hợp không có ID (ví dụ: trang tạo mới)
      // Có thể reset form về giá trị mặc định ở đây nếu cần
       console.log("No customer ID provided in URL. Likely create mode.");
       // form.reset({ customerType: 'CUSTOMER', ... }); // Ví dụ giá trị mặc định
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch, form.reset, notify]); // Thêm form.reset và notify vào dependencies

  // --- Fetch Customer Groups ---
  const fetchCustomerGroup = useCallback(async () => {
    dispatch(setLoadingCustomer(true)); // Có thể tạo loading riêng cho group nếu muốn
    try {
      // Gọi service lấy danh sách group với filters hiện tại
      const response = await getCustomerGroups(filters);
      if (response?.data) {
        // Dispatch action của customer-group-slice
        dispatch(fetchCustomerGroups(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch customer groups', error);
      // notify({ message: 'Lỗi khi tải danh sách nhóm khách hàng', severity: 'error' });
    } finally {
      dispatch(setLoadingCustomer(false)); // Tắt loading chung
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dispatch]); // filters thường là object, có thể cần JSON.stringify nếu thay đổi sâu

  // --- Fetch Customer Contacts (riêng biệt, nếu cần) ---
  const fetchCustomerContacts = useCallback(async () => {
    if (id) { // Chỉ fetch khi có ID khách hàng
      const numericId = Number(id);
      if (isNaN(numericId)) return; // Không fetch nếu ID không hợp lệ

      try {
        dispatch(setLoadingCustomer(true)); // Loading chung
        // Tạo payload lọc theo customerId
        const contactFilters = {
          ...filters, // Giữ lại các filter khác (page, limit, sort...)
          filter: onChangeFilter({ customerId: numericId }), // Thêm filter customerId
        };
        const response = await getCustomerContacts(contactFilters);
        const data = response?.data;
        if (data?.items) {
          // Dispatch action của customer-slice
          dispatch(setCustomersContact(data.items));
        } else {
          dispatch(setCustomersContact([])); // Đặt thành rỗng nếu không có dữ liệu
        }
      } catch (error: any) {
        console.error('Failed to fetch customer contacts:', error);
        notify({
          message: error?.message || 'Lỗi khi tải danh bạ khách hàng',
          severity: 'error',
        });
      } finally {
        dispatch(setLoadingCustomer(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filters, dispatch, notify, onChangeFilter]);

  // --- Fetch Customer Addresses (riêng biệt, nếu cần) ---
  const fetchCustomerAddress = useCallback(async () => {
     if (id) { // Chỉ fetch khi có ID khách hàng
      const numericId = Number(id);
      if (isNaN(numericId)) return; // Không fetch nếu ID không hợp lệ

      try {
        dispatch(setLoadingCustomer(true)); // Loading chung
         // Tạo payload lọc theo customerId
        const addressFilters = {
          ...filters, // Giữ lại các filter khác
          filter: onChangeFilter({ customerId: numericId }), // Thêm filter customerId
        };
        const response = await getCustomerAddresses(addressFilters);
        const data = response?.data;
        if (data?.items) {
          // Dispatch action của customer-address-slice
          dispatch(setCustomerAddress(data.items));
        } else {
           dispatch(setCustomerAddress([])); // Đặt thành rỗng nếu không có dữ liệu
        }
      } catch (error: any) {
        console.error('Failed to fetch customer addresses:', error);
        notify({
          message: error?.message || 'Lỗi khi tải địa chỉ khách hàng',
          severity: 'error',
        });
      } finally {
        dispatch(setLoadingCustomer(false));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, filters, dispatch, notify, onChangeFilter]);


  // --- useEffect Hooks ---
  useEffect(() => {
    // Fetch chi tiết khách hàng khi ID thay đổi (hoặc khi component mount lần đầu có ID)
    fetchCustomer();
  }, [fetchCustomer]); // fetchCustomer giờ là dependency ổn định nhờ useCallback

  useEffect(() => {
    // Fetch danh sách nhóm khách hàng khi filters thay đổi
    fetchCustomerGroup();
  }, [fetchCustomerGroup]); // fetchCustomerGroup giờ là dependency ổn định

  // Cân nhắc xem có cần fetch contacts/addresses riêng biệt ở đây không,
  // vì fetchCustomer đã dispatch dữ liệu contacts/addresses lấy từ getCustomerById rồi.
  // Nếu getCustomerById không trả về contacts/addresses, thì mới cần gọi riêng:
  // useEffect(() => {
  //   fetchCustomerContacts();
  // }, [fetchCustomerContacts]);
  // useEffect(() => {
  //   fetchCustomerAddress();
  // }, [fetchCustomerAddress]);

  // Cleanup effect: Chạy khi component unmount
  useEffect(() => {
    return () => {
      // Reset state của contacts và addresses khi rời khỏi trang
      console.log('Cleaning up customer data slices');
      dispatch(setCustomersContact([]));
      dispatch(setCustomerAddress([]));
      // Có thể reset cả currentCustomerDetail nếu bạn dùng nó
      // dispatch(setCurrentCustomerDetail(null));
    };
  }, [dispatch]); // Chỉ phụ thuộc vào dispatch (ổn định)

  // Trả về các hàm fetch để có thể gọi lại thủ công nếu cần
  return {
    fetchCustomer,
    fetchCustomerContacts,
    fetchCustomerAddress,
    fetchCustomerGroup, // Thêm hàm này nếu cần gọi lại từ bên ngoài
  };
};

export default useFetchData;