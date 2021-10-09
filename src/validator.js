import * as yup from 'yup';

export default (url, list) => {
  const schema = yup.string().url().notOneOf(list).required();
  return schema.validate(url);
};
