import gpl from 'graphql-tag';

export default gpl`
mutation deleteProject($id:ID) {
  deleteProject(where:{id:$id}) {
    id
  }
}
`