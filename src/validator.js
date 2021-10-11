import * as yup from 'yup';

export default (url, list) => yup.string()
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
