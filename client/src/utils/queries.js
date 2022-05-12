import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  {
    user {
        _id
        username
        email
        bookCount
        savedBooks {
          authors
          description
          bookId
          image
          link
          title
        }
      }
  }
`;