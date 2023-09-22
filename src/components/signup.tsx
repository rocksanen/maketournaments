import React, { Dispatch, SetStateAction, useState } from 'react'

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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '5px',
      }}
    >
      {props.isSignInMode ? (
        <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 'bolder' }}>New Here?</h2>
          <p>Create an account and start your journey with us</p>
          <button
            style={{
              border: '2px solid #fff',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              color: 'white',
              width: '50%',
            }}
            onClick={() => props.setSignInMode(false)}
          >
            SIGN UP
          </button>
        </div>
      ) : (
        <div style={{ width: '75%' }}>
          <h2>Create Account</h2>
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                minLength={1}
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {isEmailInvalid && <span>A user already exists with the entered email</span>}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
              <button
                type="submit"
                style={{
                  border: 'none',
                  borderRadius: '9999px',
                  backgroundColor: 'red',
                  color: 'white',
                  width: '60%',
                }}
              >
                SIGN UP
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
