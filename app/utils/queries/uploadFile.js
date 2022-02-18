import gpl from 'graphql-tag';

const QUERY = gpl`
mutation uploadFile($username:String!, $file:Upload!) {
  createFile(data: {userid:{connect:{username:$username}}, file:{upload: $file}}) {
    file {
      url
      filename
    }
  }
}
`

export default QUERY;