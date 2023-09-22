import React, { Dispatch, SetStateAction, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface SignInProps {
  isSignInMode: boolean;
  setSignInMode: Dispatch<SetStateAction<boolean>>;
}

export default function SignIn(props: SignInProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { data: session } = useSession();
  console.log('Session: ', session);

  const router = useRouter();

  const handleSignIn = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    console.log('Email: ', email);
    await signIn('credentials', {
      redirect: false,
      email,
      password,
    })
      .then((response) => {
        console.log(response);
        router.replace('/profile');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {props.isSignInMode ? (
        <div style={{ width: '75%' }}>
          <h2 style={{ fontFamily: 'monospace', fontWeight: 'bolder' }}>Sign In</h2>
          <form onSubmit={handleSignIn}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <button type="submit">SIGN IN</button>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#00000088' }}>
              <Link href="reset-password">Forgot Password?</Link>
            </div>
          </form>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize: '2.4rem', fontWeight: 'extrabold' }}>Welcome Back!</h2>
          <p style={{ fontSize: '1rem', color: 'white' }}>To continue your journey with us, please login</p>
          <button
            style={{ border: '2px solid #fff', borderRadius: '9999px', backgroundColor: 'transparent', color: 'white', width: '50%' }}
            onClick={() => props.setSignInMode(true)}
          >
            SIGN IN
          </button>
        </div>
      )}
    </div>
  );
}
