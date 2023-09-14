import userModel from '@/model/userModel'

const fetchUsers = async () => {
  const users = await userModel.find({})
  return users
}

export const resolvers = {
  Query: {
    hello: () => 'worlldd',
    //user: fetchUsers,
  },
}
