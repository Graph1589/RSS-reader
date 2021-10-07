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
  const postsContainer = document.querySelector('.posts');

  const form = document.querySelector('.rss-form');
  const urlField = document.getElementById('url-input');

  const getFeedsList = () => state.feeds.map((feed) => feed.feedLink);

  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=');

  const composeRequestUrl = (enteredUrl) => new URL(`${proxy.href}${enteredUrl}`);

  const addRSS = ({
    feedTitle, feedDescription, posts,
  }, url) => {
    const feedLink = url;
    watchedState.feeds.push({
      feedTitle, feedDescription, feedLink, id: _.uniqueId(), viewed: 'false',
    });
    const processedPosts = posts.map((post) => ({ ...post, id: _.uniqueId() }));
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
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    processEnteredUrl();
  });
  postsContainer.addEventListener('click', (event) => {
    console.log(postsContainer);
    const id = event.target.getAttribute('data-id');
    if (id) {
      console.log(postsContainer);
      const clickedPost = _.find(watchedState.posts, (post) => post.id === id);
      clickedPost.viewed = 'true';
    }
  });

  const updateRSS = () => {
    state.feeds.forEach((feed) => {
      axios.get(composeRequestUrl(feed.feedLink))
        .then((response) => {
          const { posts } = parseXML(response.data);
          const newPosts = _.differenceBy(posts, watchedState.posts, 'postTitle');
          const processedNewPosts = newPosts.map((post) => ({ ...post, id: _.uniqueId() }));
          watchedState.posts = processedNewPosts.concat(state.posts);
        });
    });
    setTimeout(() => updateRSS(), updateInterval);
  };
  console.log(postsContainer);
  setTimeout(updateRSS(), updateInterval);
};
