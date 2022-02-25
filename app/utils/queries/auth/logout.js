import gpl from 'graphql-tag';

export default gpl`
mutation logout {
  endSession
}
`