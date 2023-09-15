import SignInForm from '@/components/form/signin-form'

interface SignInPageProps {
  searchParams: {
    callbackUrl: string
  }
}

export default function SignInPage({
  searchParams: { callbackUrl },
}: SignInPageProps) {
  return (
    <div className="w-full">
      <SignInForm callbackUrl={callbackUrl || '/'} />
    </div>
  )
}
