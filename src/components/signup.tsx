import React, { Dispatch, SetStateAction, useState } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'

interface SignUpProps {
  isSignInMode: boolean
  setSignInMode: Dispatch<SetStateAction<boolean>>
}

export default function SignUp(props: SignUpProps) {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isEmailInvalid, setEmailInvalid] = useState<boolean>(false)

  const validateInputs = () => setEmailInvalid(true)

  const handleSignup = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const newUser = {
      name,
      email,
      password,
    }

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (data.userExists) {
      validateInputs()
    } else {
      setEmailInvalid(false)
      setName('')
      setEmail('')
      setPassword('')
      props.setSignInMode(true)
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <form onSubmit={handleSignup}>
        <Card className="w-96 flex items-center justify-center">
          <CardHeader className="flex items-center justify-center py-6">
            <h3 className="text-xl font-medium ml-4 text-black dark:text-white">Register</h3>
          </CardHeader>

          <Divider className="border-t border-gray-300" />

          <CardBody className="">
            <Input
              type="text"
              placeholder="Name"
              name="name"
              minLength={1}
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="py-3"
            />
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
              Register
            </Button>
          </CardBody>
          <Divider className="border-t border-gray-300" />
          <CardFooter className="flex items-center justify-center py-6">
            <p className="text-center text-black dark:text-white">
              Already have an account?
              <span
                onClick={() => props.setSignInMode(true)}
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                <span className="text-blue-400 pl-1">Sign in</span>
              </span>
            </p>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
