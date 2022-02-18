import gpl from 'graphql-tag';

export default gpl`
mutation createTrackItem(
  $projectid: ID!
  $name: String!
  $duration: Int
  $data: JSON
  $file: ID
) {
  createTrackItem(
    data: {
      project: { connect: { id: $projectid } }
      name: $name
      duration: $duration
      data: $data
      file: {connect:{id:$file}}
    }
  ) {
    id
    name
    data
    duration
    file {
        file {
            url
        }
    }
  }
}
`