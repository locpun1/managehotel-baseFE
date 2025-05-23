import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
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
  username: string;
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
  const [remember, setRemember] = useState(false);

  useEffect(() => {
    setFocus('username');
  }, [setFocus]);

  const onSubmit = async (values: LoginFormInputs) => {
    setLoading.on();
    try {
      const respAuth = await signIn({
        username: values.username,
        password: values.password,
      });

      if (respAuth.data?.accessToken) {
        setStorageToken(remember)
          .accessToken(respAuth.data.accessToken)
          .refreshToken(respAuth.data.refreshToken);
        const respUser = await getCurrentUser();
        dispatch(setProfile(respUser.data));
        dispatch(setIsAuth(true));
        setError('');
        notify({
          message: t('login_success'),
          severity: 'success',
        });
        let route = ROUTE_PATH.HOME;
        if (!_.isNull(location.state) && location.state !== ROUTE_PATH.LOGIN) {
          route = location.state;
        }
        navigate(route);
      } else {
        setFocus('username');
        setError(respAuth.message);
        throw new Error(respAuth.message);
      }
    } catch (error: any) {
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
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Welcome to Telecom!
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
            name: 'username',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Username',
            error: !!errors.username,
            helperText: errors.username?.message,
            sx: { ariaLabel: 'username' },
          }}
          prefixIcon={Email}
        />
        <ControllerTextField<LoginFormInputs>
          controllerProps={{
            name: 'password',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Password',
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
              sx={{ textAlign: 'end', display: 'block' }}
            >
              Forgot password?
            </Typography>
          </Box>
          <FormControlLabel
            label={'Remember me'}
            control={
              <Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            }
          />
        </div>
        <LoadingButton loading={_loading} type='submit' variant='contained' fullWidth>
          Login
        </LoadingButton>
        {/* <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' gap={2}>
          <Typography>Don't have an account</Typography>
          <Typography
            to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.REGISTRATION}`}
            component={RouterLink}
            color='primary'
          >
            Create an account
          </Typography>
        </Box> */}
      </Box>
    </Page>
  );
}
