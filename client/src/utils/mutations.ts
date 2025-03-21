import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($password: String!, $email: String) {
  login(password: $password, email: $email) {
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
`

export const SAVE_BOOK = gql`
  mutation saveBook($book: BookInput!) {
  saveBook(book: $book) {
    _id
    username
    email
    savedBooks {
      bookId
      authors
      description
      image
      link
      title
    }
  }
}
`;

export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    _id
  }
}
`;