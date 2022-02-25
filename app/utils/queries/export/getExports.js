import gpl from 'graphql-tag';

export default gpl`
{
  exports {
    id
    status
    project {
      name
    }
    sizes {
      id
      name
    }
  }
}
`