import gpl from 'graphql-tag';

export default gpl`
mutation updateTrackItem(
  $id: ID!
  $name: String!
  $duration: Int!
  $data: JSON!
) {
  updateTrackItem(
    where: { id: $id }
    data: { name: $name, duration: $duration, data: $data }
  ) {
    id
  }
}

`