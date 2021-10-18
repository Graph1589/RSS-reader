import onChange from 'on-change';
import {
  renderInputValid,
  renderError,
  renderSuccess,
  renderOutput,
  renderButton,
} from './renderers.js';

export default (state, i18nextInstance, elementsForRenderers) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.valid':
      renderInputValid(value, elementsForRenderers);
      break;
    case 'form.error':
      renderError(value, i18nextInstance, elementsForRenderers);
      break;
    case 'form.btnDisabled':
      renderButton(value, elementsForRenderers);
      break;
    case 'form.message':
      renderSuccess(value, i18nextInstance, elementsForRenderers);
      break;
    case 'feeds':
      renderOutput(
        state,
        i18nextInstance,
        elementsForRenderers,
      );
      break;
    case 'posts':
      renderOutput(
        state,
        i18nextInstance,
        elementsForRenderers,
      );
      break;
    case 'viewedPostsId':
      renderOutput(
        state,
        i18nextInstance,
        elementsForRenderers,
      );
      break;
    default:
      break;
  }
});
