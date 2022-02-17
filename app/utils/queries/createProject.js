import gpl from 'graphql-tag';

export default gpl`
mutation createProject($username: String!, $name: String!) {
    createProject(data:{userid: {connect: {username: $username}}, name: $name}) {
        id
    }
}
`