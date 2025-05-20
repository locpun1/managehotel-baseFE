import type { Row } from '@tanstack/react-table';
import { useMemo } from 'react';
import { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

import useFetchData from './hooks/useFetchData';
import {
  ActionRowParams,
  CreateActionRowParams,
  useBaseColumns,
} from '@/components/DynamicFormTable/BaseColumns';

import useDialog from '@/hooks/useDialog';
import useNotification from '@/hooks/useNotification';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  updateCustomerAddress,
} from '@/services/customer-service';
import {
  CreateCustomerAddressRequest,
  CreateCustomerForm,
  CustomerAddress,
} from '@/types/customer-types';

interface Props {
  form: UseFormReturn<CreateCustomerForm>;
  fieldArray: UseFieldArrayReturn<CreateCustomerForm, 'addresses', 'fieldId'>;
}

const useAddressTableColumns = ({ form, fieldArray }: Props) => {
  const { t } = useTranslation('customer');
  const { getValues } = form;
  const dialog = useDialog();
  const notify = useNotification();
  const { id } = useParams();
  const { remove: removeAddress, replace } = fieldArray;
  const { fetchCustomerAddress } = useFetchData({ form });

  const onDelete = async ({ row }: ActionRowParams<CustomerAddress>) => {
    if (!row.original.id) {
      removeAddress(row.index);
    } else {
      dialog({
        headline: t('customer_address.delete_address'),
        supportingText: t('customer_address.delete_address_content'),
        onConfirm: async () => {
          try {
            const res = await deleteCustomerAddress(Number(row.original.id));
            if (res.statusCode === 200) {
              fetchCustomerAddress();
              notify({
                message: t('customer_address.delete_address_success'),
                severity: 'success',
              });
            }
          } catch (error) {
            console.error(error);
            notify({
              message: t('customer_address.error_delete_address'),
              severity: 'error',
            });
          }
        },
      });
    }
  };

  const onUpdateDefaultAddress = async (row: Row<CustomerAddress>) => {
    try {
      if (!row.original.id) return;
      const res = await updateCustomerAddress(Number(row.original.id), {
        isDefault: row.original.isDefault ? false : true,
      });
      if (res?.statusCode === 200) {
        fetchCustomerAddress();
        notify({
          message: t('customer_address.update_address_success'),
          severity: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        message: t('customer_address.error_update_address'),
        severity: 'error',
      });
    }
  };

  const onUpdate = async ({ row, setEditId }: ActionRowParams<CustomerAddress>) => {
    const addresses = getValues('addresses');
    if (!row.original.id || !addresses) return;
    const address = addresses[row.index];
    if (!address) return;
    if (address.address === '') {
      form.setError(`addresses.${row.index}.address`, {
        message: t('customer_addresses.required'),
      });
      return;
    }
    try {
      const res = await updateCustomerAddress(Number(address.id), {
        postCode: address.postCode,
        address: address.address,
        area: address.area,
        district: address.district,
        province: address.province,
        country: address.country,
      });
      if (res?.statusCode === 200) {
        setEditId(null);
        fetchCustomerAddress();
        notify({
          message: t('customer_address.update_address_success'),
          severity: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        message: t('customer_address.error_update_address'),
        severity: 'error',
      });
    }
  };

  const onCreate = async ({ row, setEditId }: CreateActionRowParams<CustomerAddress>) => {
    const addresses = getValues('addresses');
    if (!addresses) return;
    const address = addresses[row.index];
    if (!address) return;
    if (address.address === '') {
      form.setError(`addresses.${row.index}.address`, {
        message: t('customer_addresses.required'),
      });
      return;
    }
    const payload: CreateCustomerAddressRequest = {
      postCode: address.postCode,
      address: address.address,
      area: address.area,
      district: address.district,
      province: address.province,
      country: address.country,
      isDefault: address.isDefault,
      customerId: Number(id) || 0,
    };
    try {
      const res = await createCustomerAddress(payload);
      if (res?.statusCode === 200) {
        setEditId(null);
        fetchCustomerAddress();
        notify({
          message: t('customer_address.create_address_success'),
          severity: 'success',
        });
      }
    } catch (error) {
      console.error(error);
      notify({
        message: t('customer_address.create_address_error'),
        severity: 'error',
      });
    }
  };

  const handleDefaultChange = ({ row }: CreateActionRowParams<CustomerAddress>) => {
    if (row.original.id) {
      dialog({
        headline: t('customer_address.update_default_address'),
        supportingText: !row.original.isDefault
          ? t('customer_address.update_default_address_content_default')
          : t('customer_address.update_default_address_content_not_default'),
        onConfirm: () => onUpdateDefaultAddress(row),
      });
    } else {
      const addresses = getValues('addresses');
      if (!addresses) return;
      const newAddresses = addresses.map((addr, idx) => ({
        ...addr,
        isDefault: addr.isDefault ? false : idx === row.index,
      }));
      replace(newAddresses);
    }
  };

  const { createBaseTextColumn, createCheckboxColumn, actionColumn, editId } = useBaseColumns<
    CustomerAddress,
    CreateCustomerForm
  >({
    onDelete,
    onUpdate,
    onCreate: id ? onCreate : undefined,
    key: 'addresses',
    onCheckboxChange: handleDefaultChange,
    form,
  });

  const columns = useMemo(
    () => [
      createBaseTextColumn('postCode', t('post_code'), 150),
      createBaseTextColumn('address', t('address'), 200),
      createBaseTextColumn('area', t('area'), 150),
      createBaseTextColumn('district', t('district'), 150),
      createBaseTextColumn('province', t('province'), 150),
      createBaseTextColumn('country', t('country'), 150),
      createCheckboxColumn('isDefault', t('default'), 100, { isDisable: !!editId }),
      actionColumn,
    ],
    [t, createCheckboxColumn],
  );

  return { columns };
};

export default useAddressTableColumns;
