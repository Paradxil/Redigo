import gpl from 'graphql-tag';

export default gpl`
mutation deleteTrackItem(
  $id: ID!
) {
  deleteTrackItem(where:{id:$id}) {
    id
  }
}
`