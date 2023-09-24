import { useState } from 'react'
import SignIn from './signin'
import SignUp from './signup'

export default function Form() {
  const [isSignInMode, setSignInMode] = useState<boolean>(true)
  return (
    <div>
      {isSignInMode ? (
        <SignIn isSignInMode={isSignInMode} setSignInMode={setSignInMode} />
      ) : (
        <SignUp isSignInMode={isSignInMode} setSignInMode={setSignInMode} />
      )}
    </div>
  )
}
