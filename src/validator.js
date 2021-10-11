import * as yup from 'yup';

export default (url, list) => {
  const schema = yup.string().url().notOneOf(list).required();
  return schema.validateSync(url);
};

/* yup.string()
  .url()
  .notOneOf(list)
  .required()
  .validateSync(url);
/*
  } catch (e) {
    e.isValidationError = true;
    throw e;
  }
};
*/
