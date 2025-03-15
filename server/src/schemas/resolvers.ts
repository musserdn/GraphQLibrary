import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';


interface UserArgs {
    id?: string;
    username?: string;
}

interface AddUserArgs {
    username: string;
    email: string;
    password: string;
}

interface LoginArgs {
    username?: string;
    email?: string;
    password: string;
}

interface SaveBookArgs {
    book: any;
}
interface RemoveBookArgs {
    bookId: string;
}

const resolvers = {
    Query: {
        me: async (_parent: any, args: UserArgs, context: any) => {
            const foundUser = await User.findOne({
                $or: [{ _id: context.user ? context.user._id : args.id }, { username: args.username }],
            });

            if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id!');
            }

            return foundUser;
        },
    },
    Mutation: {
        addUser: async (_parent: any, args: AddUserArgs) => {
            const user = await User.create(args);

            if (!user) {
                throw new Error('Something is wrong!');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        login: async (_parent: any, args: LoginArgs) => {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }
            const token = signToken(user.username, user.email, user._id);
            return { token, user };
        },
        saveBook: async (_parent: any, args: SaveBookArgs, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            try {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: args.book } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            } catch (err) {
                console.log(err);
                throw new Error('Error saving book');
            }
        },
        removeBook: async (_parent: any, args: RemoveBookArgs, context: any) => {
            if (!context.user) {
                throw new AuthenticationError('You need to be logged in!');
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: args.bookId } } },
                { new: true }
            );
            if (!updatedUser) {
                throw new AuthenticationError("Couldn't find user with this id!");
            }
            return updatedUser;
        },
    },
};

export default resolvers;