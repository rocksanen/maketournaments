'use client'

import { useForm } from 'react-hook-form'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { userSignInValidation } from '@/lib/validations/auth'
import { signIn } from 'next-auth/react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface SignInFormProps {
  callbackUrl: string
}

function SignInForm({ callbackUrl }: SignInFormProps) {
  const { pending } = useFormStatus()

  const form = useForm<z.infer<typeof userSignInValidation>>({
    resolver: zodResolver(userSignInValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userSignInValidation>) => {
    await signIn('credentials', {
      email: values.email,
      password: values.password,
      callbackUrl,
    })
  }

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
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
        </div>
        <Button className="w-full mt-6" type="submit" disabled={pending}>
          {pending ? 'Submitting...' : 'Sign in'}
        </Button>
      </form>
      <div className="flex items-center justify-center my-4">
        <div className="border-b border-gray-400 w-full"></div>
        <span className="px-2 text-gray-400">or</span>
        <div className="border-b border-gray-400 w-full"></div>
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        Don&apos;t have an account?&nbsp;
        <Link className="text-blue-600 hover:underline" href="/signup">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default SignInForm
