import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { AccountCircle, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import ControllerTextField from '@/components/ControllerField/ControllerTextField';
import Page from '@/components/Page';

import { ROUTE_PATH } from '@/constants/routes';
import useBoolean from '@/hooks/useBoolean';
import useNotification from '@/hooks/useNotification';
import { loginSchema } from '@/schemas/auth-schema';
import { signIn } from '@/services/auth-service';
import { getCurrentUser } from '@/services/user-service';
import { setIsAuth } from '@/slices/auth';
import { setProfile } from '@/slices/user';
import { useAppDispatch } from '@/store';
import { setStorageToken } from '@/utils/AuthHelper';
import Logger from '@/utils/Logger';

interface LoginFormInputs {
  identifier: string;
  password: string;
}

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
  });
  const { t } = useTranslation('auth');
  const [_loading, setLoading] = useBoolean();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const notify = useNotification();
  const [_error, setError] = useState('');
  const [showPassword, setShowPassword] = useBoolean(false);
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    setFocus('identifier');
  }, [setFocus]);

  const onSubmit = async (values: LoginFormInputs) => {
    setLoading.on();
    try {
      const respAuth = await signIn({
        identifier: values.identifier,
        password: values.password,
      });
      
      if(respAuth.success){
        if (respAuth.data?.tokens) {
                setStorageToken(remember)
                  .accessToken(respAuth.data.tokens.access.token)
                  .refreshToken(respAuth.data.tokens.refresh.token);
                const respUser = await getCurrentUser();
                dispatch(setProfile(respUser.data));
                dispatch(setIsAuth(true));
                setError('');
                notify({
                  message: t('login_success'),
                  severity: 'success',
                });
                console.log("respUser: ",respUser);
                
                let route = respUser.data?.role === "manager" ? `/${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}` :  ROUTE_PATH.HOME;
                
                if (!_.isNull(location.state) && location.state !== ROUTE_PATH.LOGIN) {
                  route = location.state;
                }
                navigate(route);
              } 
      }else {
        setFocus('identifier');
        setError(respAuth.message);
        throw new Error(respAuth.message);
      }
    } catch (error: any) {
      const apiErrorMessage = error?.response?.data?.message ||
                            error?.message || 
                            t('login_error_occurred') || 
                            'An unexpected error occurred.';
      setError(apiErrorMessage);
      Logger.log(error);
    } finally {
      setLoading.off();
    }
  };

  return (
    <Page title='Login'>
      <Box>
        <Typography
          component='h1'
          variant='h4'
          fontWeight={500}
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign:"center" }}
        >
          Đăng nhập
        </Typography>
      </Box>
      {_error && (
        <Alert variant='filled' severity='warning'>
          {_error}
        </Alert>
      )}
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <ControllerTextField<LoginFormInputs>
          controllerProps={{
            name: 'identifier',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Tài khoản',
            error: !!errors.identifier,
            helperText: errors.identifier?.message,
            sx: { ariaLabel: 'identifier' },
          }}
          prefixIcon={AccountCircle}
        />
        <ControllerTextField<LoginFormInputs>
          controllerProps={{
            name: 'password',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Mật khẩu',
            type: showPassword ? 'text' : 'password',
            error: !!errors.password,
            helperText: errors.password?.message,
            slotProps: {
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword.toggle()}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            },
          }}
          prefixIcon={Lock}
        />
        <div>
          <Box>
            <Typography
              color='primary'
              component={RouterLink}
              to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.FORGOT_PASSWORD}`}
              sx={{ textAlign: 'end', display: 'block', fontSize: '14px' }}
            >
              Quên mật khẩu?
            </Typography>
          </Box>
          {/* <FormControlLabel
            label={'Remember me'}
            control={
              <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            }
          /> */}
        </div>
        <LoadingButton loading={_loading} type='submit' variant='outlined' fullWidth
          sx={{
            color:"#00C7BE",
            borderColor: "#00C7BE",
          }}
        >
          Đăng nhập
        </LoadingButton>
        <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' gap={2}>
          <Typography>Bạn chưa có tài khoản</Typography>
          <Typography
            to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.REGISTRATION}`}
            component={RouterLink}
            color='primary'
          >
            Đăng ký tài khoản
          </Typography>
        </Box>
      </Box>
    </Page>
  );
}
