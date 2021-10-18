import onChange from 'on-change';
import {
  renderInputValid,
  renderError,
  renderMessage,
  renderOutput,
  renderBlockForm,
} from './renderers.js';

const processStateHandler = {
  filling: ({ elementsForRenderers }) => (
    renderBlockForm(false, elementsForRenderers)
  ),
  processing: ({ elementsForRenderers }) => (
    renderBlockForm(true, elementsForRenderers)
  ),
  finished: ({ message, i18nextInstance, elementsForRenderers }) => (
    renderMessage(message, i18nextInstance, elementsForRenderers)
  ),
  failed: ({ error, i18nextInstance, elementsForRenderers }) => (
    renderError(error, i18nextInstance, elementsForRenderers)
  ),
};

export default (state, i18nextInstance, elementsForRenderers) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.state': {
      const params = {
        i18nextInstance,
        elementsForRenderers,
        message: state.form.message,
        error: state.form.error,
      };
      processStateHandler[value](params);
    }
      break;
    case 'form.valid':
      renderInputValid(value, elementsForRenderers);
      break;
    case 'feeds':
    case 'posts':
    case 'viewedPostsId':
      renderOutput(
        state,
        i18nextInstance,
        elementsForRenderers,
      );
      break;
    default:
      console.log(`unexpected path caught : ${path}`);
      break;
  }
});
