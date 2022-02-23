import gpl from 'graphql-tag';

const QUERY = gpl`
{
    files {
        id
        file {
            filename
            url
        }
        type
    }
}
`

export default QUERY;