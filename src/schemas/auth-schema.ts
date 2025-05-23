import { object, ref, string } from 'yup';

export const usernameValidateSchema = string().required('Username is required');

const passwordValidateSchema = string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')
  .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
  .matches(/\d/, 'Password must contain at least one number');

const confirmPasswordValidateSchema = (label: string) =>
  string()
    .oneOf([ref(label)], "Password and Confirm Password didn't match")
    .required('Confirm Password is required');

const passwordSchema = <T extends string>(label: T) =>
  object().shape({
    password: passwordValidateSchema,
    confirmPassword: confirmPasswordValidateSchema(label),
  });

export const loginSchema = object().shape({
  username: usernameValidateSchema,
  password: string().required('Password is required'),
});

export const registrationSchema = object()
  .shape({
    username: usernameValidateSchema,
  })
  .concat(passwordSchema('password'));

export const resetPasswordValidationSchema = object()
  .shape({
    oldPassword: passwordValidateSchema,
  })
  .concat(passwordSchema('password'));

export const changePasswordSchema = passwordSchema('password');
