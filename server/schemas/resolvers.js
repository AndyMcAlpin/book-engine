const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
            const foundUser = await User.findOne({ _id: context.user._id })
              .select('-__v - password')
              .populate('savedBooks')
          
              return foundUser;
            }
            throw new AuthenticationError('Not logged in!');
          }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);

            if (!user) {
                throw new AuthenticationError('Something is wrong!');
            }

            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        saveBook: async (parent, args, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $push: { savedBooks: { ...args } } },
                  { new: true, runValidators: true }
                );
                return updatedUser;
            } 
            throw new AuthenticationError('Something went wrong!');
        },
        deleteBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: context.user._id },
                  { $pull: { savedBooks: { bookId: bookId } } },
                  { new: true }
                );
                return updatedUser;
            } 
            throw new AuthenticationError("Couldn't find user with this id!");
        },
    }
};

module.exports = resolvers;