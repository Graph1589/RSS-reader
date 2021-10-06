import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales/index.js';
import validate from './validator.js';
import parseXML from './parser.js';
import view from './view.js';

export default () => {
  const state = {
    form: {
      valid: true,
      error: undefined,
      message: undefined,
      btnDisabled: false,
    },
    feeds: [],
    posts: [],
  };

  const i18nextInstance = i18next.createInstance();
  const watchedState = view(state, i18nextInstance);
  const updateInterval = 5000;

  const form = document.querySelector('form');
  const urlField = document.getElementById('url-input');

  const getFeedsList = () => state.feeds.map((feed) => feed.feedLink);

  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=');

  const composeRequestUrl = (enteredUrl) => new URL(`${proxy.href}${enteredUrl}`);

  const addRSS = ({
    feedTitle, feedDescription, posts,
  }, url) => {
    const feedLink = url;
    const id = _.uniqueId();
    watchedState.feeds.push({
      feedTitle, feedDescription, feedLink, id, viewed: 'false',
    });
    const processedPosts = posts.map((post) => ({ ...post, id }));
    watchedState.posts = processedPosts.concat(state.posts);
  };

  const processEnteredUrl = () => {
    watchedState.form.valid = true;
    watchedState.form.error = undefined;
    watchedState.form.message = undefined;
    watchedState.form.btnDisabled = true;
    const url = urlField.value;
    const list = getFeedsList();
    validate(url, list)
      .then(() => axios.get(composeRequestUrl(url)))
      .then((response) => parseXML(response.data))
      .then((parsedRSS) => {
        addRSS(parsedRSS, url);
      })
      .then(() => {
        watchedState.form.message = 'added';
      })
      .catch((error) => {
        if (error.request) {
          watchedState.form.error = 'network';
        } else if (error.message === 'parsingError') {
          watchedState.form.error = 'wrongData';
        } else {
          watchedState.form.valid = false;
          watchedState.form.error = error.type;
        }
      })
      .then(() => {
        watchedState.form.btnDisabled = false;
      });
  };

  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      processEnteredUrl();
    });
  });

  const addNewPosts = (newPosts, id) => {
    const processedNewPosts = newPosts.map((post) => ({ ...post, id }));
    watchedState.posts = processedNewPosts.concat(state.posts);
  };

  const updateRSS = () => {
    state.feeds.forEach((feed) => {
      axios.get(composeRequestUrl(feed.feedLink))
        .then((response) => {
          const { posts } = parseXML(response.data);
          const newPosts = _.differenceBy(posts, watchedState.posts, 'postTitle');
          addNewPosts(newPosts, feed.id);
        });
    });
    setTimeout(() => updateRSS(), updateInterval);
  };

  setTimeout(updateRSS(), updateInterval);
};
