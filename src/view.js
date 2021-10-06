import onChange from 'on-change';
import {
  renderInputValid,
  renderError,
  renderSuccess,
  renderOutput,
  renderButton,
} from './renderers.js';

export default (state, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.valid':
      renderInputValid(value);
      break;
    case 'form.error':
      renderError(value, i18nextInstance);
      break;
    case 'form.btnDisabled':
      renderButton(value);
      break;
    case 'form.message':
      renderSuccess(value, i18nextInstance);
      break;
    case 'feeds':
      renderOutput(state, i18nextInstance);
      break;
    case 'posts':
      renderOutput(state, i18nextInstance);
      break;
    default:
      break;
  }
});
