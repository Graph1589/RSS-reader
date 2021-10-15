import onChange from 'on-change';
import {
  renderInputValid,
  renderError,
  renderSuccess,
  renderOutput,
  renderButton,
} from './renderers.js';

export default (state, i18nextInstance, elementsForRenderers) => onChange(state, (path, value) => {
  const {
    submitButton,
    urlInput,
    feedback,
    feedsContainer,
    postsContainer,
    showModal,
    modalTitle,
    modalContent,
    modalRedirectButton,
  } = elementsForRenderers;
  switch (path) {
    case 'form.valid':
      renderInputValid(value, urlInput);
      break;
    case 'form.error':
      renderError(value, i18nextInstance, feedback);
      break;
    case 'form.btnDisabled':
      renderButton(value, submitButton, urlInput);
      break;
    case 'form.message':
      renderSuccess(value, i18nextInstance, feedback, urlInput);
      break;
    case 'feeds':
      renderOutput(
        state,
        i18nextInstance,
        feedsContainer,
        postsContainer,
        modalTitle,
        modalContent,
        modalRedirectButton,
        showModal,
      );
      break;
    case 'posts':
      renderOutput(
        state,
        i18nextInstance,
        feedsContainer,
        postsContainer,
        modalTitle,
        modalContent,
        modalRedirectButton,
        showModal,
      );
      break;
    case 'viewedPostsId':
      renderOutput(
        state,
        i18nextInstance,
        feedsContainer,
        postsContainer,
        modalTitle,
        modalContent,
        modalRedirectButton,
        showModal,
      );
      break;
    default:
      break;
  }
});
