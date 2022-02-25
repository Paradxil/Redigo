import gpl from 'graphql-tag'

export default gpl`
mutation createExport($projectid: ID!, $sizes: [ExportSizeWhereUniqueInput!]) {
  createExport(
    data: {
      project: { connect: { id: $projectid } }
      sizes: { connect: $sizes }
    }
  ) {
    id
  }
}
`