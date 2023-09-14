import userModel from '@/model/userModel'
import { Query } from 'mongoose'

const fetchUser = async () => {
  const users = await userModel.findOne({ email: "kalle@testmail.com" });
  return users
}

//post user to database for testing purposes
const postUser = async () => {
  const user = new userModel({
    name: "Pelle Hermanni",
    email: "pelle@testmail.com",
    password: "123456",
  })
  const newUser = await user.save()
  return newUser
}


export const resolvers = {
  Query: {
    user: postUser,
  }
}
