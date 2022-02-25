import gpl from 'graphql-tag';

export default gpl`
{
  exportSizes {
    id
    name
    width
    height
    framerate
  }
}
`