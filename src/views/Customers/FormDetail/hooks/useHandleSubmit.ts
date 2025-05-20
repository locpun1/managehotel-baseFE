import { uniq } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { ROUTE_PATH } from '@/constants/routes';
import useNotification from '@/hooks/useNotification';
import { createCustomer, updateCustomer } from '@/services/customer-service';
import { setLoadingCustomer } from '@/slices/customer-slice';
import { useAppDispatch } from '@/store';
import { CreateCustomerForm, UpdateCustomerForm } from '@/types/customer-types';

const useHandleSubmit = () => {
  const { id } = useParams();
  const notify = useNotification();
  const { t } = useTranslation(['customer', 'error']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleUpdateCustomer = async (data: CreateCustomerForm) => {
    const updateData: UpdateCustomerForm = {
      name: data.name,
      customerGroupId: data.customerGroupId ? data.customerGroupId : undefined,
      customerType: data.customerType,
    };

    const respone = await updateCustomer(id!, updateData);
    if (respone.statusCode === 200) {
      notify({
        message: t('update_success'),
        severity: 'success',
      });
      navigate(ROUTE_PATH.CUSTOMERS_LIST);
    } else {
      throw new Error(respone.message);
    }
  };

  const handleCreateCustomer = async (data: CreateCustomerForm) => {
    delete data.createdById;
    const newData = {
      ...data,
      customerGroupId: data.customerGroupId ? data.customerGroupId : undefined,
    };
    const respone = await createCustomer(newData);
    if (respone.statusCode === 200) {
      notify({
        message: t('create_success'),
        severity: 'success',
      });
      navigate(ROUTE_PATH.CUSTOMERS_LIST);
    } else {
      throw new Error(respone.message);
    }
  };

  const onSubmit = async (data: CreateCustomerForm) => {
    dispatch(setLoadingCustomer(true));
    try {
      const contactTypes = data.contacts?.map((field) => field.contactType);
      const hasDuplicates = uniq(contactTypes).length !== contactTypes?.length;
      if (hasDuplicates) {
        notify({
          message: t('customer_contact.unique_contact_type'),
          severity: 'error',
        });
        return;
      }

      if (id) {
        await handleUpdateCustomer(data);
      } else {
        await handleCreateCustomer(data);
      }
    } catch (error: any) {
      notify({
        message: t(error.errorCode),
        severity: 'error',
      });
    } finally {
      dispatch(setLoadingCustomer(false));
    }
  };

  return { onSubmit };
};

export default useHandleSubmit;
