'use client'

import { useForm } from 'react-hook-form'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { changePasswordValidation } from '@/lib/validations/auth'
import { ChangeUserPasswordParams } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ChangePasswordProps {
  changeUserPassword: (
    values: ChangeUserPasswordParams
  ) => Promise<{ success?: boolean }>
}

function ChangePasswordForm({ changeUserPassword }: ChangePasswordProps) {
  const router = useRouter()
  const { pending } = useFormStatus()

  const form = useForm<z.infer<typeof changePasswordValidation>>({
    resolver: zodResolver(changePasswordValidation),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof changePasswordValidation>) => {
    const res = await changeUserPassword({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    })

    if (res?.success) {
      // Show notification Toast?
      signOut({
        redirect: true,
        callbackUrl: `${window.location.origin}/signin`,
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <label>Old Password</label>
          <Input
            type="password"
            placeholder="your old password"
            {...form.register('oldPassword')}
          />
        </div>
        <div>
          <label>New Password</label>
          <Input
            type="password"
            placeholder="your new password"
            {...form.register('newPassword')}
          />
        </div>
        <div>
          <label>Confirm your new password</label>
          <Input
            type="password"
            placeholder="Confirm your new password"
            {...form.register('confirmPassword')}
          />
        </div>
        <Button className="w-full mt-6" type="submit" disabled={pending}>
          {pending ? 'Submitting...' : 'Submit'}
        </Button>
        <Button
          onClick={() => router.back()}
          className="w-full mt-2"
          disabled={pending}
        >
          Cancel
        </Button>
      </form>
    </div>
  )
}

export default ChangePasswordForm
