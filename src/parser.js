export default (string) => {
  const parser = new DOMParser();
  const xmlDocument = parser.parseFromString(string, 'text/xml');
  const errorNode = xmlDocument.querySelector('parsererror');
  if (errorNode) {
    const error = new Error('String is not a valid XML document');
    error.isParsingError = true;
    throw error;
  }
  const feedTitle = xmlDocument.querySelector('title').textContent;
  const feedDescription = xmlDocument.querySelector('description').textContent;
  const posts = [...xmlDocument.querySelectorAll('item')].map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postLink = item.querySelector('link').textContent;
    const postDescription = item.querySelector('description').textContent;
    return {
      title: postTitle, link: postLink, description: postDescription,
    };
  });
  return {
    title: feedTitle, description: feedDescription, items: posts,
  };
};
