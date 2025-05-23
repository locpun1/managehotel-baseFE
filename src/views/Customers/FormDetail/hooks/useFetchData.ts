import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useParams } from 'react-router-dom';

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
import { setCustomersContact, setLoadingCustomer } from '@/slices/customer-slice';
import { useAppDispatch } from '@/store';

interface IProps {
  form: UseFormReturn<any>;
}

const useFetchData = ({ form }: IProps) => {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const notify = useNotification();
  const { filters, onChangeFilter } = useTableFilters();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  useEffect(() => {
    fetchCustomerGroup();
  }, [filters]);

  useEffect(() => {
    return () => {
      dispatch(setCustomersContact([]));
      dispatch(setCustomerAddress([]));
    };
  }, []);

  const fetchCustomerGroup = async () => {
    dispatch(setLoadingCustomer(true));
    try {
      const response = await getCustomerGroups(filters);
      if (response.data) {
        dispatch(fetchCustomerGroups(response.data));
      }
    } catch (error) {
      console.error('Failed to fetch customer groups', error);
    } finally {
      dispatch(setLoadingCustomer(false));
    }
  };

  const fetchCustomer = async () => {
    if (id) {
      try {
        dispatch(setLoadingCustomer(true));
        const response = await getCustomerById(id);
        const data = response.data;
        if (data) {
          form.reset({
            name: data.name,
            customerType: data.customerType,
            customerGroupId: data?.customerGroup?.id || null,
          });
          dispatch(setCustomersContact(data?.customerContacts));
          dispatch(setCustomerAddress(data?.customerAddresses));
        } else {
          console.error('Customer not found');
        }
      } catch (error: any) {
        notify({
          message: error.message,
          severity: 'error',
        });
      } finally {
        dispatch(setLoadingCustomer(false));
      }
    }
  };

  const fetchCustomerContacts = async () => {
    try {
      dispatch(setLoadingCustomer(true));
      const response = await getCustomerContacts({
        ...filters,
        filter: onChangeFilter({ customerId: Number(id) ?? '' }),
      });
      const data = response.data;
      if (data) {
        dispatch(setCustomersContact(data.items));
      }
    } catch (error: any) {
      notify({
        message: error.message,
        severity: 'error',
      });
    } finally {
      dispatch(setLoadingCustomer(false));
    }
  };

  const fetchCustomerAddress = async () => {
    try {
      dispatch(setLoadingCustomer(true));
      const response = await getCustomerAddresses({
        ...filters,
        filter: onChangeFilter({ customerId: Number(id) ?? '' }),
      });
      const data = response.data;
      if (data) {
        dispatch(setCustomerAddress(data?.items));
      }
    } catch (error: any) {
      notify({
        message: error.message,
        severity: 'error',
      });
    } finally {
      dispatch(setLoadingCustomer(false));
    }
  };

  return {
    fetchCustomer,
    fetchCustomerContacts,
    fetchCustomerAddress,
  };
};

export default useFetchData;
