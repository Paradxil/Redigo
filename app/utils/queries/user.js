import gpl from 'graphql-tag';

export default gpl`
{
  user: authenticatedItem {
    __typename
    ... on User {
        username
    }
  }
}
`