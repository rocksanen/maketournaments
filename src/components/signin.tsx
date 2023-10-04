import React, { Dispatch, SetStateAction, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'

interface SignInProps {
  isSignInMode: boolean
  setSignInMode: Dispatch<SetStateAction<boolean>>
}

export default function SignIn(props: SignInProps) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const { data: session } = useSession()
  console.log('Session: ', session)

  const router = useRouter()

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    console.log('Email: ', email)
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
      .then((response) => {
        console.log(response)
        router.back()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSignIn}>
        <Card className="w-96 flex items-center justify-center">
          <CardHeader className="flex items-center justify-center py-6">
            <h3 className="text-xl font-medium ml-4 text-black dark:text-white">Login</h3>
          </CardHeader>

          <Divider className="border-t border-gray-300" />

          <CardBody className="">
            <Input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="py-3"
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              fullWidth
              className="py-3"
            />
          </CardBody>

          <CardBody className="p-6">
            <Button color="primary" type="submit">
              Login
            </Button>
          </CardBody>
          <Divider className="border-t border-gray-300" />
          <CardFooter className="flex items-center justify-center py-6">
            <p className="text-center text-black dark:text-white">
              Don&apos;t have an account?
              <span
                onClick={() => props.setSignInMode(false)}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                <span className="text-blue-400 pl-1">Register</span>
              </span>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
