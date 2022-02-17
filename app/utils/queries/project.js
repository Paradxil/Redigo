import gpl from 'graphql-tag';

export default gpl`
query getProject($id: ID) {
    project(where:{id:$id}) {
        name
        backgroundTrack {
            name
            duration
            data
        }
    }
}
`