import userModel from '@/model/userModel';

interface UserArgs {
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
    }
};

export default userResolvers;