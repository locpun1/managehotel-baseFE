import axios from 'axios';
import { useEffect } from 'react';

import LoadingOverlay from '@/components/ProTable/core/LoadingOverlay';

import { getCurrentUser } from '@/services/user-service';
import { setInitApp, setIsAuth, setProfile } from '@/slices/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { FCC } from '@/types/react';
import { getStorageToken } from '@/utils/AuthHelper';
import Logger from '@/utils/Logger';

const InitLoadingProvider: FCC = ({ children }) => {
  const { isInitialized } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const requestUser = async () => {
    try {
      if (getStorageToken.accessToken) {
        const resp = await getCurrentUser();
        
        const isAuth = resp.statusCode === axios.HttpStatusCode.Ok;
        
        dispatch(setIsAuth(isAuth));
        if (isAuth) {
          dispatch(setProfile(resp.data));
        }
      }
    } catch (error) {
      Logger.log(error);
    } finally {
      dispatch(setInitApp());
    }
  };

  useEffect(() => {
    requestUser();
  }, []);

  return (
    <>
      <LoadingOverlay visible={!isInitialized} />
      {isInitialized && children}
    </>
  );
};

export default InitLoadingProvider;
