import gpl from 'graphql-tag';

const QUERY = gpl`
mutation login($username: String!, $password: String!) {
  loginResult: authenticateUserWithPassword(username: $username, password: $password) {
    ... on UserAuthenticationWithPasswordSuccess {
      sessionToken
      item {
        username
        email
      }
    }
    ... on UserAuthenticationWithPasswordFailure {
      message
    }
  }
}
`

export default QUERY;