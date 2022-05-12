const { User, Book } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, { user = null, params }) => {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
              });
          
              if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id!');  
              }
          
              return { foundUser };
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
        login: async (parent, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username: username }, { email: email }] });

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
        saveBook: async (parent, { user, body }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  { $addToSet: { savedBooks: body } },
                  { new: true }
                );
                return updatedUser;
            } 
            throw new AuthenticationError('Something went wrong!');
        },
        deleteBook: async (parent, { user, params }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  { $pull: { savedBooks: { bookId: params.bookId } } },
                  { new: true }
                );
                return updatedUser;
            } 
            throw new AuthenticationError("Couldn't find user with this id!");
        },
    }
};

module.exports = resolvers;