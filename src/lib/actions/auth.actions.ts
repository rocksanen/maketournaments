import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth'
import { nextauthOptions } from '@/lib/nextauthOptions'
import { connectToDatabase } from '@/utils/db'
import User from '@/model/userModel'

export async function getUserSession () {
  const session = await getServerSession(nextauthOptions)
  return ({ session })
}

interface GetUserByEmailParams {
  email: string
}

export async function getUserByEmail({
  email
}: GetUserByEmailParams) {
  connectToDatabase()

  const user = await User.findOne({email}).select('-password')
  
  if (!user) {
    throw new Error('User does not exist!')
  }

  return {...user._doc, _id: user._id.toString()}
}

export interface UpdateUserProfileParams {
  name: string,
}

export async function updateUserProfile ({
  name
}: UpdateUserProfileParams) {
  'use server'
  const session = await getServerSession(nextauthOptions)

  connectToDatabase()
    
  try {
    if (!session) {
      throw new Error('Unauthorized!')
    }

    const user = await User.findByIdAndUpdate(session?.user?._id, {
      name
    }, { new: true }).select('-password')
  
    if (!user) {
      throw new Error('User does not exist!')
    }
  
    return { success: true }
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`)
  }
}

export interface SignUpWithCredentialsParams {
  name: string,
  email: string,
  password: string,
}

export async function signUpWithCredentials ({
  name,
  email,
  password
}: SignUpWithCredentialsParams) {
  'use server'
  connectToDatabase()

  try {
    const user = await User.findOne({email})

    if (user) {
      throw new Error('User already exists.')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    // console.log({newUser})
    await newUser.save()

    return { success: true }
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`)
  }
}

export interface SignInWithCredentialsParams {
  email: string,
  password: string,
}

export async function signInWithCredentials ({
  email,
  password
}: SignInWithCredentialsParams) {
  connectToDatabase()
  
  const user = await User.findOne({email})

  if (!user) {
    throw new Error('Invalid email or password!')
  }

  const passwordIsValid = await bcrypt.compare(
    password,
    user.password
  )

  if (!passwordIsValid) {
    throw new Error('Invalid email or password!')
  }
    
  return {...user._doc, _id: user._id.toString()}
}

export interface ChangeUserPasswordParams {
  oldPassword: string,
  newPassword: string
}

export async function changeUserPassword ({
  oldPassword,
  newPassword
}: ChangeUserPasswordParams) {
  'use server'
  const { session } = await getUserSession()

  connectToDatabase()

  try {
    if (!session) {
      throw new Error('Unauthorized!')
    }
  
    if (session?.user?.provider !== 'credentials') {
      throw new Error(`Signed in via ${session?.user?.provider}. Changes not allowed with this method.`)
    }

    const user = await User.findById(session?.user?._id)
  
    if (!user) {
      throw new Error('User does not exist!')
    }

    const passwordIsValid = await bcrypt.compare(
      oldPassword,
      user.password
    )

    if (!passwordIsValid) {
      throw new Error('Incorrect old password.')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword
    })

    return { success: true }
  } catch (error) {
    redirect(`/error?error=${(error as Error).message}`)
  }
}