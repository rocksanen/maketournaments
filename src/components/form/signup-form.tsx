'use client'

import { useForm } from 'react-hook-form'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { userSignUpValidation } from '@/lib/validations/auth'
import { SignUpWithCredentialsParams } from '@/lib/actions/auth.actions'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SignUpFormProps {
  callbackUrl: string
  signUpWithCredentials: (
    values: SignUpWithCredentialsParams
  ) => Promise<{ success?: boolean }>
}

function SignUpForm({ signUpWithCredentials }: SignUpFormProps) {
  const router = useRouter()
  const { pending } = useFormStatus()

  const form = useForm<z.infer<typeof userSignUpValidation>>({
    resolver: zodResolver(userSignUpValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userSignUpValidation>) => {
    const res = await signUpWithCredentials(values)

    if (res?.success) {
      console.log('Logged in')
      router.push('/signin')
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <label>Username</label>
          <Input placeholder="your username" {...form.register('name')} />
        </div>
        <div>
          <label>Email</label>
          <Input placeholder="mail@example.com" {...form.register('email')} />
        </div>
        <div>
          <label>Password</label>
          <Input
            type="password"
            placeholder="your password"
            {...form.register('password')}
          />
        </div>
        <div>
          <label>Confirm your password</label>
          <Input
            type="password"
            placeholder="Confirm your password"
            {...form.register('confirmPassword')}
          />
        </div>
        <Button className="w-full mt-6" type="submit" disabled={pending}>
          {pending ? 'Submitting...' : 'Sign up'}
        </Button>
      </form>
      <div className="flex items-center justify-center my-4">
        <div className="border-b border-gray-400 w-full"></div>
        <span className="px-2 text-gray-400">or</span>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Already have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signin">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default SignUpForm
