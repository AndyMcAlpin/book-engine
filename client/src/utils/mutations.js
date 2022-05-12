import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login(($username: String) || ($email: String), $password: String!) {
    login((username: $username) || (email: $email), password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_BOOK = gql`
mutation saveBook($bookId: String!, $description: String!, $title: String!, $authors: [String], $image: String, $link: String) {
    saveBook(bookId: $bookId, description: $description, title: $title, authors: $authors, image: $image, link: $link) {
        _id
        username
    }
}
`;

export const DELETE_BOOK = gql`
mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
        _id
        username
    }
}
`;