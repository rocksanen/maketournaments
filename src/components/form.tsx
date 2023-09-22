import { useState } from 'react'
import SignIn from './signin'
import SignUp from './signup'

export default function Form() {
  const [isSignInMode, setSignInMode] = useState<boolean>(false)
  return (
    <div>
      <div>
        <SignIn isSignInMode={isSignInMode} setSignInMode={setSignInMode} />
      </div>
      <div>
        <SignUp isSignInMode={isSignInMode} setSignInMode={setSignInMode} />
      </div>
    </div>
  )
}
