'use client'

import { useForm } from 'react-hook-form'
import { experimental_useFormStatus as useFormStatus } from 'react-dom'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { userUpdateValidation } from '@/lib/validations/auth'
import { UpdateUserProfileParams } from '@/lib/actions/auth.actions'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RxAvatar } from 'react-icons/rx'

interface UpdateFormProps {
  updateUserProfile: (
    values: UpdateUserProfileParams
  ) => Promise<{ success?: boolean }>
}

function UpdateForm({ updateUserProfile }: UpdateFormProps) {
  const { data: session, update } = useSession()
  const { pending } = useFormStatus()

  const form = useForm<z.infer<typeof userUpdateValidation>>({
    resolver: zodResolver(userUpdateValidation),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof userUpdateValidation>) => {
    update({ name: values.name })
    const res = await updateUserProfile(values)

    if (res?.success) {
      // Show notification. Toast?
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <RxAvatar size={70} />
        <div>
          <label>{session?.user.name}</label>
          <Input placeholder="new username" {...form.register('name')} />
        </div>
        <Button className="w-full mt-6" type="submit" disabled={pending}>
          {pending ? 'Submitting...' : 'Update'}
        </Button>
      </form>
      {session?.user.provider === 'credentials' && (
        <>
          <div className="flex items-center justify-center mt-4 mb-8">
            <div className="border-b border-gray-400 w-full"></div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            <Link
              className="text-blue-600 hover:underline"
              href="/change-password"
            >
              Change Password
            </Link>
          </p>
        </>
      )}
    </div>
  )
}

export default UpdateForm
