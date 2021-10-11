import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    viewedPostsId: new Set(),
  };

  const i18nextInstance = i18next.createInstance();
  const watchedState = view(state, i18nextInstance);
  const updateInterval = 5000;
  const postsContainer = document.querySelector('.posts');
  const form = document.getElementById('rss-form');
  const urlField = document.getElementById('url-input');

  const getFeedsList = () => state.feeds.map((feed) => feed.link);

  const proxify = (url) => {
    const proxy = 'https://hexlet-allorigins.herokuapp.com';
    const proxifiedUrl = new URL('/get?', proxy);
    proxifiedUrl.searchParams.append('disableCache', 'true');
    proxifiedUrl.searchParams.append('url', `${url}`);
    return proxifiedUrl;
  };

  const addRSS = ({
    title, description, items,
  }, url) => {
    const link = url;
    watchedState.feeds.push({
      title, description, link, id: _.uniqueId(),
    });
    const processedPosts = items.map((post) => ({ ...post, id: _.uniqueId() }));
    watchedState.posts = processedPosts.concat(state.posts);
  };

  const processEnteredUrl = () => {
    watchedState.form.message = undefined;
    watchedState.form.valid = true;
    watchedState.form.error = undefined;
    watchedState.form.btnDisabled = true;
    const url = urlField.value;
    const list = getFeedsList();
    const initPromise = new Promise((resolve) => resolve());
    initPromise
      .then(() => {
        validate(url, list);
      })
      .catch((e) => {
        const error = { ...e, isValidationError: true };
        throw error;
      })
      .then(() => axios.get(proxify(url)))
      .then((response) => parseXML(response.data.contents))
      .then((parsedRSS) => {
        addRSS(parsedRSS, url);
      })
      .then(() => {
        watchedState.form.message = 'added';
      })
      .catch((error) => {
        switch (true) {
          case error.isAxiosError:
            watchedState.form.error = 'network';
            break;
          case error.isParsingError:
            watchedState.form.error = 'wrongData';
            break;
          case error.isValidationError:
            watchedState.form.valid = false;
            watchedState.form.error = error.type;
            break;
          default:
            throw new Error(`unexpected error - ${error}`);
        }
      })
      .then(() => {
        watchedState.form.btnDisabled = false;
      });
  };

  const updateRSS = () => {
    const feedsUpdatePromises = state.feeds.map((feed) => axios.get(proxify(feed.link))
      .then((response) => {
        const { items } = parseXML(response.data.contents);
        const newPosts = _.differenceBy(items, watchedState.posts, 'title');
        const processedNewPosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
        watchedState.posts = processedNewPosts.concat(state.posts);
      }));
    Promise.all(feedsUpdatePromises)
      .then(() => {
        setTimeout(() => updateRSS(), updateInterval);
      });
  };

  return i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      processEnteredUrl();
    });
  }).then(() => {
    postsContainer.addEventListener('click', (event) => {
      const { id } = event.target.dataset;
      if (id) {
        watchedState.viewedPostsId.add(id);
      }
    });
  }).then(() => {
    setTimeout(updateRSS(), updateInterval);
  });
};
