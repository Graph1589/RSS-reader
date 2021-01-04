// еще две ошибки?
// ***
// разнести по модулям - вотчер
// сделать рендер ошибок и успехов через соответствующие функции
// подключение i18next в шаблон и в вывод ошибок
// организовать обновление rss потоков  и рендер после обновления

import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
// import _, { isEmpty } from 'lodash';
import resources from './locales';
import { renderLayout, renderInputError, renderFeedError } from './renderers';
import validate from './validator';
import parseXML from './parser';
// import view form './view';


const proxy = 'https://cors-anywhere.herokuapp.com/';

export default () => {
  const state = {
    form: {
      processState: 'filling',
      injectedUrl: '',
      valid: true,
      inputError: '',
      feedError: '',
    },
    layout: {
      feeds: [],
      posts: [],
    },
  };

  const form = document.querySelector('[class="rss-form form-inline"]');
  const urlField = document.querySelector('[class="form-control"]');
  const submitButton = document.querySelector('[class="btn btn-primary"]');

  const feedbackSuccess = document.querySelector('[class="feedback text-success"]');

  const processStateHandler = (processState) => {
    console.log(processState);
    switch (processState) {
      case 'failed':
        submitButton.disabled = false;
        break;
      case 'filling':
        submitButton.disabled = false;
        break;
      case 'sending':
        submitButton.disabled = true;
        break;
      case 'finished':
        urlField.value = '';
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  };

  // вотчер (позже вынести в модуль)
  /*
  const watchedState = view(state);
  */

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.processState':
        processStateHandler(value);
        break;
      case 'form.valid':
        submitButton.disabled = !value;
        break;
      case 'form.inputError':
        renderInputError(value);
        break;
      case 'form.feedError':
        renderFeedError(value);
        break;
      case 'layout.posts':
        renderLayout(state);
        break;
      default:
        break;
    }
  });

  const getFeedsList = () => watchedState.layout.feeds.map((feed) => feed.url);

  const updateValidationState = () => {
    const error = validate(watchedState.form.injectedUrl, getFeedsList());
    watchedState.form.valid = (error === '');
    console.log(`updatevalidationstate-ERROR-${error}`);
    watchedState.form.inputError = error;
  };

  const addRSS = ({
    url, streamTitle, streamDescription, posts,
  }) => {
    watchedState.layout.feeds = [{ url, streamTitle, streamDescription }, ...state.layout.feeds];
    watchedState.layout.posts = posts.concat(state.layout.posts);
  };

  urlField.addEventListener('input', (e) => {
    feedbackSuccess.textContent = '';
    watchedState.form.processState = 'filling';
    watchedState.form.injectedUrl = e.target.value;
    updateValidationState(watchedState);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('sending');
    watchedState.form.processState = 'sending';
    axios.get(`${proxy}${urlField.value}`)
      .then((response) => {
        const parsedRSS = parseXML(response.request.response, urlField.value);
        console.log(`response.data = ${response.data}`);
        addRSS(parsedRSS);
        watchedState.form.processState = 'finished';
      })
      .catch(() => {
        console.log('catch in GET');
        console.log(`BEFORE watchedState.form.feedError = ${watchedState.form.feedError}`);
        watchedState.form.feedError = 'network';
        console.log(`AFTER watchedState.form.feedError = ${watchedState.form.feedError}`);
      });
  });

  i18next.init({
    lng: 'en',
    debug: false,
    resources,
  }).then((t) => {
    renderLayout(state, t);
  });
};
