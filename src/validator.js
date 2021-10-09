import * as yup from 'yup';

/* export default (url, list) => yup.string()
  .url()
  .notOneOf(list)
  .required()
  .validate(url);
*/
export default (url, list) => {
  const schema = yup.string().notOneOf(list).required();
  return schema.validate(url);
}
