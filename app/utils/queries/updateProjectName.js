import gpl from 'graphql-tag';

export default gpl`
mutation updateProjectName($id: ID, $name:String!) {
  updateProject(where:{id:$id}, data:{name:$name}) {
    id
  }
}
`