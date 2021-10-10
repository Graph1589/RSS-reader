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

  const getFeedsList = () => state.feeds.map((feed) => feed.feedLink);

  const proxify = (url) => {
    const proxy = 'https://hexlet-allorigins.herokuapp.com';
    const proxifiedUrl = new URL('/get?', proxy);
    proxifiedUrl.searchParams.append('disableCache', 'true');
    proxifiedUrl.searchParams.append('url', `${url}`);
    return proxifiedUrl;
  };

  // const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=');

  // const composeRequestUrl = (enteredUrl) => new URL(`${proxy.href}${enteredUrl}`);

  const addRSS = ({
    feedTitle, feedDescription, posts,
  }, url) => {
    const feedLink = url;
    watchedState.feeds.push({
      feedTitle, feedDescription, feedLink, id: _.uniqueId(),
    });
    const processedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
    watchedState.posts = processedPosts.concat(state.posts);
  };

  const processEnteredUrl = () => {
    watchedState.form.message = undefined;
    watchedState.form.valid = true;
    watchedState.form.error = undefined;
    watchedState.form.btnDisabled = true;
    const url = urlField.value;
    const list = getFeedsList();
    validate(url, list)
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

  i18nextInstance.init({
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
  });

  const updateRSS = () => {
    state.feeds.forEach((feed) => {
      axios.get(proxify(feed.feedLink))
        .then((response) => {
          const { posts } = parseXML(response.data.contents);
          const newPosts = _.differenceBy(posts, watchedState.posts, 'postTitle');
          const processedNewPosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
          watchedState.posts = processedNewPosts.concat(state.posts);
        });
    });
    setTimeout(() => updateRSS(), updateInterval);
  };
  setTimeout(updateRSS(), updateInterval);
};
