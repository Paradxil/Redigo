import gpl from 'graphql-tag';

export default gpl`
query getProject($id: ID) {
    project(where:{id:$id}) {
        name
        trackItems {
            id
            name
            duration
            file {
                id
                file {
                    url
                }
            }
            data
            type
        }
        track
    }
}
`