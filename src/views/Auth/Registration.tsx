import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { Email, Lock, Person, Visibility, VisibilityOff,  } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import ControllerTextField from '@/components/ControllerField/ControllerTextField';
import Page from '@/components/Page';

import { ROUTE_PATH } from '@/constants/routes';
import useBoolean from '@/hooks/useBoolean';
import useNotification from '@/hooks/useNotification';
import { registrationSchema } from '@/schemas/auth-schema';
import { signUp } from '@/services/auth-service';

interface RegistrationFormInputs {
  fullName: string;
  phone_number: string;
  password: string;
  confirmPassword: string;
}

export default function Registration() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setFocus,
    trigger,
  } = useForm<RegistrationFormInputs>({
    resolver: yupResolver(registrationSchema),
  });
  const password = watch('password');
  const [_loading, setLoading] = useBoolean();
  const navigate = useNavigate();
  const notify = useNotification();
  const { t } = useTranslation('auth');
  const [_error, setError] = useState('');
  const [showPassword, setShowPassword] = useBoolean(false);
  const [showConfirmPassword, setShowConfirmPassword] = useBoolean(false);

  useEffect(() => {
    setFocus('phone_number');
  }, [setFocus]);

  useEffect(() => {
    if (password && password?.length === getValues('confirmPassword')?.length) {
      trigger('confirmPassword');
    }
  }, [password, trigger]);

  const onSubmit = async (values: RegistrationFormInputs) => {
    setLoading.on();
    try {
      const { confirmPassword, ...payload} = values;
      await signUp(payload);
      notify({
        message: t('registration_success'),
        severity: 'success',
      });
      
      navigate(ROUTE_PATH.TO_LOGIN);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading.off();
    }
  };

  return (
    <Page title='Registration'>
      <Box component='form' onSubmit={handleSubmit(onSubmit)}>
        <Typography 
          variant='h4' 
          component='h1' 
          gutterBottom
          fontWeight={500}
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign:"center" }}
        >
          Đăng ký
        </Typography>
        {_error && (
          <Alert variant='filled' severity='warning'>
            {_error}
          </Alert>
        )}
        <ControllerTextField<RegistrationFormInputs>
          controllerProps={{
            name: 'fullName',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'ID người dùng',
            error: !!errors.fullName,
            helperText: errors.fullName?.message,
          }}
          prefixIcon={Person}
        />
        <ControllerTextField<RegistrationFormInputs>
          controllerProps={{
            name: 'phone_number',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Tài khoản',
            error: !!errors.phone_number,
            helperText: errors.phone_number?.message,
          }}
          prefixIcon={Email}
        />
        <ControllerTextField<RegistrationFormInputs>
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
                endAdornment:(
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      onClick={() => setShowPassword.toggle()}
                      edge='end'
                    >
                      {showPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
          prefixIcon={Lock}
        />
        <ControllerTextField<RegistrationFormInputs>
          controllerProps={{
            name: 'confirmPassword',
            defaultValue: '',
            control: control,
          }}
          textFieldProps={{
            label: 'Nhập lại mật khẩu',
            type: showConfirmPassword ? 'text' : 'password',
            error: !!errors.confirmPassword,
            helperText: errors.confirmPassword?.message,
            slotProps:{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle confirm password visibility'
                      onClick={() =>  setShowConfirmPassword.toggle()}
                      edge='end'
                    > 
                        {showConfirmPassword ? <VisibilityOff/> : <Visibility/>}
                    </IconButton>
                  </InputAdornment>
                )
              }
            }
          }}
          prefixIcon={Lock}
        />
        <LoadingButton
          loading={_loading}
          type='submit'
          variant='outlined'
          fullWidth
          sx={{ 
            my: 2,
            color:"#00C7BE",
            borderColor: "#00C7BE", 
          }}
        >
          Đăng ký
        </LoadingButton>
        <Box display='flex' justifyContent='center' alignItems='center' flexWrap='wrap' gap={2}>
          <Typography> Bạn đã có tài khoản</Typography>
          <Typography
            color='primary'
            component={Link}
            to={`/${ROUTE_PATH.AUTH}/${ROUTE_PATH.LOGIN}`}
          >
            Đăng nhập tài khoản
          </Typography>
        </Box>
      </Box>
    </Page>
  );
}
