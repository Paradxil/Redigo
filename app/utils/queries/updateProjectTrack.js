import gpl from 'graphql-tag';

export default gpl`
mutation updateProjectTrack($id: ID!, $track:JSON!) {
  updateProject(where:{id:$id}, data:{track:$track}) {
    id
  }
}
`