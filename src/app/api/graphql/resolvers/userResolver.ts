import userModel from '@/model/userModel';
import bcrypt from 'bcrypt';

interface UserArgs {
    id: string;
}

interface CreateUserArgs {
    name: string;
    email: string;
    password: string;
    // add other fields as necessary
}

interface UpdateUserArgs {
    id: string;
    name?: string;
    email?: string;
    password?: string;
    // add other fields as necessary
}

interface DeleteUserArgs {
    id: string;
}

const userResolvers = {
    Query: {
        user: async (_: any, { id }: UserArgs) => {
            try {
                const user = await userModel.findById(id);
                return user;
            } catch (error) {
                console.error("Failed to fetch user:", error);
                throw new Error('Failed to fetch user');
            }
        },

        allUsers: async () => {
            try {
                const users = await userModel.find();
                return users;
            } catch (error) {
                console.error("Failed to fetch users:", error);
                throw new Error('Failed to fetch users');
            }
        },
    },
    Mutation: {
        createUser: async (_: any, args: CreateUserArgs) => {
            try {
                // Hash the password before saving
                const hashedPassword = await bcrypt.hash(args.password, 10);
                
                const newUser = new userModel({
                    ...args,
                    password: hashedPassword,
                });
                
                const result = await newUser.save();
                return result;
            } catch (error) {
                console.error("Failed to create user:", error);
                throw new Error('Failed to create user');
            }
        },

        updateUser: async (_: any, { id, ...args }: UpdateUserArgs) => {
            try {
                if (args.password) {
                    // Hash the new password before updating
                    args.password = await bcrypt.hash(args.password, 10);
                }

                const updatedUser = await userModel.findByIdAndUpdate(id, args, {
                    new: true // returns the updated document
                });
                return updatedUser;
            } catch (error) {
                console.error("Failed to update user:", error);
                throw new Error('Failed to update user');
            }
        },

        deleteUser: async (_: any, { id }: DeleteUserArgs) => {
            try {
                const deletedUser = await userModel.findByIdAndRemove(id);
                if (!deletedUser) {
                    throw new Error('User not found');
                }
                return deletedUser;
            } catch (error) {
                console.error("Failed to delete user:", error);
                throw new Error('Failed to delete user');
            }
        }
    }
};

export default userResolvers;