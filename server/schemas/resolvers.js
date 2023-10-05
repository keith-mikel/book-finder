const { User } = require('../models'); // Import your User model
const { AuthenticationError } = require('@apollo/server');
const { signToken } = require('../utils/auth'); // Import a function to generate tokens

const resolvers = {
  Query: {
    me: async (_, args, context) => {
      // Check if the user is authenticated (you can implement this logic as per your setup)
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to access this resource');
      }

      // Return the authenticated user
      return context.user;
    },
  },
  Mutation: {
    login: async (_, { email, password }) => {
      // Find the user by email
      const user = await User.findOne({ email });

      // If the user does not exist or the password is incorrect, throw an error
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError('Invalid credentials');
      }

      // Generate a token for the user
      const token = signToken(user);

      // Return the user and token in the Auth type
      return { user, token };
    },
    addUser: async (_, { username, email, password }) => {
      // Create a new user
      const user = await User.create({ username, email, password });

      // Generate a token for the new user
      const token = signToken(user);

      // Return the user and token in the Auth type
      return { user, token };
    },
    saveBook: async (_, { bookInput }, context) => {
      // Check if the user is authenticated (you can implement this logic as per your setup)
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to access this resource');
      }

      // Add the book to the user's savedBooks array
      context.user.savedBooks.push(bookInput);
      await context.user.save();

      // Return the updated user
      return context.user;
    },
    removeBook: async (_, { bookId }, context) => {
      // Check if the user is authenticated (you can implement this logic as per your setup)
      if (!context.user) {
        throw new AuthenticationError('You must be logged in to access this resource');
      }

      // Remove the book from the user's savedBooks array by filtering it out
      context.user.savedBooks = context.user.savedBooks.filter(
        (book) => book.bookId !== bookId
      );

      await context.user.save();

      // Return the updated user
      return context.user;
    },
  },
};

module.exports = resolvers;
