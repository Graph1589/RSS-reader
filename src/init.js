import resources from './locales';
import i18next from 'i18next';
import validate from './validator'
import view from './view';
import axios from 'axios';
import parseXML from './parser.js'
import _ from 'lodash';

export default () => {
  const state = {
    form: {
      valid: true,
      error: undefined,
    },
    feeds: [],
    posts: [],
  };
  
  const form = document.querySelector('form');
  const urlField = document.getElementById('url-input');

  const getFeedsList = () => state.feeds.map((feed) => feed.feedLink);

  const proxy = new URL('https://hexlet-allorigins.herokuapp.com/raw?disableCache=true&url=');

  const composeRequestUrl = (enteredUrl) => new URL(`${proxy.href}${enteredUrl}`);

  const addRSS = ({
    feedTitle, feedDescription, posts,
  }, url) => {
    const feedLink = url;
    console.log('indide addRSS function')
    const id = _.uniqueId();
    watchedState.feeds = [{
      feedTitle, feedDescription, feedLink, id, viewed: 'false',
    }, ...state.feeds];
    const processedPosts = posts.map((post) => ({ ...post, id }));
    watchedState.posts = processedPosts.concat(state.posts);
  };

  const processingEnteredUrl = () => {
    watchedState.form.valid = true;
    watchedState.form.error = undefined;
    const url = urlField.value;
    const list = getFeedsList();
    validate(url, list).then(() => {
      // throw new Error();
    }).then(() => axios.get(composeRequestUrl(url)))
      .then((response) => parseXML(response.data)
      ).then((parsedRSS) => {
        console.log(parsedRSS);
        addRSS(parsedRSS, url);
        console.log('after adding');
      }).then(() => {})
      /*.catch(() => {
        console.log('network catch');
        throw new Error('network');
      })*/.then(() => {
        console.log(watchedState);
        console.log(state);
        console.log('sss');
      }).catch((error) => {
        console.log('general catch')
        console.log(error);
        console.log(JSON.stringify(error));
        switch (error) {
          case 'url':
            console.log('catch url case');
            watchedState.form.valid = false;
            watchedState.form.error = error.type;
            break;
          case 'network':
            console.log('catch network case');
            watchedState.error = error.type;
        }
      })
  };

  
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    console.log(i18nextInstance.t('errors.url'));
    return 'QQQ';
  }).then((i) => {
    console.log(i);
  }).then(() => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      processingEnteredUrl();
    });
  });
  
  const watchedState = view(state, i18nextInstance);

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
        })
    });
  
    setTimeout(() => updateRSS(), 5000);
  };

  setTimeout(updateRSS(), 5000);
}


/*
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales';
import {
  renderLayout, renderInputError, renderFeedError, renderSuccessMessage,
} from './renderers';
import validate from './validator';
import parseXML from './parser';
import view from './view';

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

  i18next.init({
    lng: 'en',
    debug: false,
    resources,
  }).then(() => {
    // renderLayout(state, t);
  });

  const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?disableCache=true&url=';

  const form = document.querySelector('[class="rss-form"]');
  const submitButton = document.querySelector('[id="submit-button"]');
  const urlField = document.querySelector('[id="url-field"]');

  const feedbackSuccess = document.querySelector('[class="feedback text-success"]');

  const processStateHandler = (processState) => {
    switch (processState) {
      case 'failed':
        submitButton.disabled = true;
        break;
      case 'filling':
        submitButton.disabled = false;
        urlField.disabled = false;
        renderSuccessMessage('');
        renderFeedError('');
        break;
      case 'networkError':
        console.log('NETWORK ERROR MESSAGE FROM HANDLER');
        renderFeedError('network');
        submitButton.disabled = false;
        urlField.disabled = false;
        break;
      case 'sending':
        renderFeedError('');
        form.disabled = true;
        submitButton.disabled = true;
        urlField.disabled = true;
        break;
      case 'finished':
        urlField.value = '';
        urlField.disabled = false;
        renderSuccessMessage('added');
        renderFeedError('');
        break;
      default:
        throw new Error(`Unknown state: ${processState}`);
    }
  };

  const watchedState = view(
    state, processStateHandler, renderInputError, renderFeedError, renderLayout,
  );

  const getFeedsList = () => state.layout.feeds.map((feed) => feed.feedLink);

  const updateValidationState = () => {
    const error = validate(watchedState.form.injectedUrl, getFeedsList());
    watchedState.form.valid = (error === '');
    watchedState.form.inputError = error;
    return error;
  };

  urlField.addEventListener('input', (e) => {
    e.preventDefault();
    feedbackSuccess.textContent = '';
    watchedState.form.processState = 'filling';
    watchedState.form.injectedUrl = e.target.value;
    updateValidationState();
  });

  const addNewPosts = (newPosts, id) => {
    const processedNewPosts = newPosts.map((post) => ({ ...post, id }));
    watchedState.layout.posts = processedNewPosts.concat(state.layout.posts);
  };

  const addRSS = ({
    streamTitle, streamDescription, posts, feedLink,
  }) => {
    const id = _.uniqueId();
    watchedState.layout.feeds = [{
      streamTitle, streamDescription, feedLink, id, viewed: 'false',
    }, ...state.layout.feeds];
    const processedPosts = posts.map((post) => ({ ...post, id }));
    watchedState.layout.posts = processedPosts.concat(state.layout.posts);
  };

  const getRSS = (url) => {
    axios.get(`${proxy}${url}`)
      .then((response) => {
        const parsedRSS = parseXML(response.data, url);
        addRSS(parsedRSS);
        watchedState.form.processState = 'finished';
      })
      .catch(() => {
        watchedState.form.feedError = 'network';
        watchedState.form.feedError = '';
      });
  };

  const updateRSS = () => {
    watchedState.layout.feeds.forEach((feed) => {
      axios.get(`${proxy}${feed.feedLink}`)
        .then((response) => {
          const { posts } = parseXML(response.data, feed.feedLink);
          const newPosts = _.differenceBy(posts, watchedState.layout.posts, 'postTitle');
          addNewPosts(newPosts, feed.id);
        })
        .catch((e) => {
          throw new Error(e);
        });
    });

    setTimeout(() => updateRSS(), 5000);
  };

  setTimeout(updateRSS(), 5000);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (updateValidationState() === '') {
      watchedState.form.processState = 'sending';
      getRSS(urlField.value);
    }
  });

  setInterval(() => {
    console.log(state.form.processState);
  }, 1000);
};
*/