import * as z from 'zod';

export const userSignInValidation = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z.string()
    .min(1, 'Password is required')
    .min(8, 'Password must have 8 or more characters'),
})

export const userSignUpValidation = z
  .object({
    name: z.string()
      .min(1, 'Username is required')
      .max(50),
    email: z.string()
      .min(1, 'Email is required')
      .email('Invalid email'),
    password: z.string()
      .min(1, 'Password is required')
      .min(8, 'Password must have 8 or more characters'),
    confirmPassword: z.string()
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  })

export const userUpdateValidation = z
  .object({
    name: z.string()
      .min(1, 'Username is required')
      .max(50, 'Username must be less than 50 characters')
  })

export const changePasswordValidation = z
  .object({
    oldPassword: z.string()
      .min(1, 'Old password is required')
      .min(8, 'Password must have 8 or more characters'),
    newPassword: z.string()
      .min(1, 'New password is required')
      .min(8, 'Password must have 8 or more characters'),
    confirmPassword: z.string()
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    path: ['newPassword'],
    message: 'New password must differ from old.',
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password do not match',
  })