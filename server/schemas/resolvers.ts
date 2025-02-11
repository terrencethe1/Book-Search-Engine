import User from '../models/User.js';
import { signToken, AuthenticationError } from '../services/auth.js';

const resolvers = {
  Query: {
    me: async (_: any, __: any, context: any) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new AuthenticationError('Not logged in');
    },
  },

  Mutation: {
    login: async (_: any, { email, password }: any) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect email or password');
      }

      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    addUser: async (_: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },

    saveBook: async (_: any, { bookData }: any, context: any) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: bookData } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },

    removeBook: async (_: any, { bookId }: any, context: any) => {
      if (context.user) {
        return User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

export default resolvers;


