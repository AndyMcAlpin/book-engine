const { gql } = require('apollo-server-express');

const typeDefs = gql`
type Book {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
    }

type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

type Query {
    user((username: String) || (_id: ID) ): User  
  }

type Mutation {
    login((username: String) || (email: String), password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, description: String!, title: String!, authors: [String], image: String, link: String): User
    deleteBook(bookId: String!): User
}
`;

module.exports = typeDefs;