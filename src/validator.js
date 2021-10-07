import * as yup from 'yup';

export default (url, list) => yup.string()
  .url()
  .notOneOf(list)
  .required()
  .validate(url);
