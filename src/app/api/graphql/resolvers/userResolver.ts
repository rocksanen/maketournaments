import userModel from '@/model/userModel';
import bcrypt from 'bcrypt';

interface UserArgs {
    id: string;
}

interface CreateUserArgs {
    input: {
        name: string;
        email: string;
        password: string;
        // add other fields as necessary
    };
}

interface UpdateUserArgs {
    input: {
        id: string;
        name?: string;
        email?: string;
        password?: string;
        // add other fields as necessary
    };
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
        createUser: async (_: any, { input }: CreateUserArgs) => {
            try {
                // Hash the password before saving
                const hashedPassword = await bcrypt.hash(input.password, 10);
                
                const newUser = new userModel({
                    ...input,
                    password: hashedPassword,
                });
                
                const result = await newUser.save();
                return result;
            } catch (error) {
                console.error("Failed to create user:", error);
                throw new Error('Failed to create user');
            }
        },

        updateUser: async (_: any, { input }: UpdateUserArgs) => {
            const { id, ...rest } = input;
            try {
                if (rest.password) {
                    // Hash the new password before updating
                    rest.password = await bcrypt.hash(rest.password, 10);
                }

                const updatedUser = await userModel.findByIdAndUpdate(id, rest, {
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
                return true;
            } catch (error) {
                console.error("Failed to delete user:", error);
                throw new Error('Failed to delete user');
            }
        }
    }
};

export default userResolvers;