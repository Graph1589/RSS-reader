import onChange from 'on-change';
import {
  renderInputValid,
  renderError,
  renderMessage,
  renderOutput,
  renderBlockForm,
} from './renderers.js';

const formStateHandler = {
  processing: (elementsForRenderers) => (
    renderBlockForm(true, elementsForRenderers)
  ),
  finished: (elementsForRenderers) => (
    renderBlockForm(false, elementsForRenderers)
  ),
  failed: (elementsForRenderers) => (
    renderBlockForm(false, elementsForRenderers)
  ),
};

export default (state, i18nextInstance, elementsForRenderers) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.state':
      formStateHandler[value](elementsForRenderers);
      break;
    case 'form.error':
      renderError(value, i18nextInstance, elementsForRenderers);
      break;
    case 'form.message':
      renderMessage(value, i18nextInstance, elementsForRenderers);
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
