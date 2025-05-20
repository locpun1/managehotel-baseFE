import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { selectCustomerGroups } from '@/slices/customer-group-slice';
import { useAppSelector } from '@/store';
import { ContactType, IdentityType } from '@/types/customer-types';

const useGetOptions = () => {
  const customerGroups = useAppSelector(selectCustomerGroups);
  const { t } = useTranslation('customer');

  const contactTypeOptions = useMemo(
    () => Object.values(ContactType).map((value) => ({ label: value, value: value })),
    [],
  );

  const customerGroupOptions = useMemo(
    () => customerGroups.map((group) => ({ value: group.id, label: group.name })),
    [customerGroups],
  );

  const identityTypeOptions = useMemo(
    () =>
      Object.values(IdentityType).map((value) => ({
        label: t(value, { keyPrefix: 'identity_type_options' }) || '',
        value: value,
      })),
    [t],
  );

  return { contactTypeOptions, customerGroupOptions, identityTypeOptions };
};

export default useGetOptions;
