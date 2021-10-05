import onChange from 'on-change';
import { renderInputValid, renderError, renderSuccess, renderOutput, renderButton } from './renderers';
import i18next from 'i18next';

export default (state, i18nextInstance) => 
  onChange(state, (path, value) => {
    switch (path) {
      case 'form.valid':
        renderInputValid(value);
        break;
      case 'form.error':
        console.log(`form-error ${value}`);
        
        renderError(value, i18nextInstance);
        break;
      case 'form.btnDisabled':
        renderButton(value);
        break;
      case 'form.message':
        console.log('message changed');
        renderSuccess(value, i18nextInstance);
      case 'feeds':
        renderOutput(state, i18nextInstance);
        break;
      case 'posts':
        renderOutput(state, i18nextInstance);
      default:
        break;
    }
  });

/*
import onChange from 'on-change';

export default (
  state, processStateHandler, renderInputError, renderFeedError, renderLayout,
) => onChange(state, (path, value) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(value);
      break;
    case 'form.valid':
      processStateHandler(value ? 'filling' : 'failed');
      break;
    case 'form.inputError':
      renderInputError(value);
      break;
    case 'form.feedError':
      processStateHandler('networkError');
      break;
    case 'layout.posts':
      renderLayout(state);
      break;
    default:
      break;
  }
});
*/