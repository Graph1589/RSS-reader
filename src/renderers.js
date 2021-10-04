
const urlInput = document.getElementById('url-input');
const feedback = document.querySelector('.feedback');

const renderInputValid = (valid) => {
  if (valid) {
    urlInput.classList.remove('is-invalid');
  } else {
    urlInput.classList.add('is-invalid');
  }
}

const renderError = (errorType, i18nextInstance) => {
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  feedback.innerText = i18nextInstance.t(`errors.${errorType}`);
  console.log(feedback);
}

const renderInputNotValid = () => {
  formInput.classList.add('is-invalid');
}

const renderOutput = (state, i18nextInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  // здесь вероятно клинер
  feedsContainer.innerHTML = '';
  // попробовать feedsContainer.innerHTML = '';

  console.log(feedsContainer);
  console.log(postsContainer);

  const feedsOutward = document.createElement('div');
  feedsOutward.classList.add('card', 'border-0');
  feedsContainer.appendChild(feedsOutward);
  
  const feedsHeaderContainer = document.createElement('div');
  feedsHeaderContainer.classList.add('card-body');
  feedsOutward.appendChild(feedsHeaderContainer);

  const feedsHeader = document.createElement('h4');
  feedsHeader.classList.add('card-title');
  feedsHeader.textContent = i18nextInstance.t('output.feeds');
  feedsHeaderContainer.appendChild(feedsHeader);

  const listOfFeeds = document.createElement('ul');
  listOfFeeds.classList.add('list-group', 'border-0', 'rounded-0');
  feedsOutward.appendChild(listOfFeeds);
  
  state.feeds.forEach((currentFeed) => {
    const { feedTitle, feedDescription } = currentFeed;
    const currentFeedItem = document.createElement('li');
    currentFeedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const currentFeedHeader = document.createElement('h6');
    currentFeedHeader.classList.add('m-0');
    currentFeedHeader.textContent = feedTitle;
    currentFeedItem.appendChild(currentFeedHeader);

    const currentFeedDescription = document.createElement('p');
    currentFeedDescription.classList.add('m-0', 'text-black-50', 'small');
    currentFeedDescription.textContent = feedDescription;
    currentFeedItem.appendChild(currentFeedDescription);

    listOfFeeds.appendChild(currentFeedItem);
  });
  
}

const renderNews = (state) => {

  const newsFeed = document.querySelector('[id="newsFeed"]');
  const modalTitle = document.querySelector('[class="modal-title"]');
  const modalContent = document.querySelector('[class="modal-body"]');
  const modalRedirectButton = document.querySelector('[id="redirectButton"]');

  const layoutCleaner = (node) => {
    if (node.hasChildNodes()) {
      node.childNodes.forEach((child) => {
        layoutCleaner(child);
      });
    }
    node.remove();
  };
  newsFeed.childNodes.forEach((childNode) => {
    layoutCleaner(childNode);
  });

  const { childNodes } = newsFeed;
  [...childNodes].forEach((childNode) => {
    layoutCleaner(childNode);
  });

  const feedsContainerCoat = document.createElement('div');
  feedsContainerCoat.classList.add('row');
  newsFeed.appendChild(feedsContainerCoat);

  const feedsContainerInward = document.createElement('div');
  feedsContainerInward.classList.add('container-fluid', 'col-lg-10', 'mx-auto', 'feeds');
  feedsContainerCoat.appendChild(feedsContainerInward);

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = 'Feeds';
  feedsContainerInward.appendChild(feedsHeader);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');
  feedsContainerInward.appendChild(feedsList);

  state.feeds.forEach((currentFeed) => {
    const currentFeedItem = document.createElement('li');
    currentFeedItem.classList.add('list-group-item');

    const currentFeedHeader = document.createElement('h3');
    currentFeedHeader.textContent = currentFeed.streamTitle;
    currentFeedItem.appendChild(currentFeedHeader);

    const currentFeedDescription = document.createElement('p');
    currentFeedDescription.textContent = currentFeed.streamDescription;
    currentFeedItem.appendChild(currentFeedDescription);

    feedsList.appendChild(currentFeedItem);
  });

  const postsContainerCoat = document.createElement('div');
  postsContainerCoat.classList.add('row');
  newsFeed.appendChild(postsContainerCoat);

  const postsContainerInward = document.createElement('div');
  postsContainerInward.classList.add('container-fluid', 'col-lg-10', 'mx-auto', 'posts');
  postsContainerCoat.appendChild(postsContainerInward);

  const postsHeader = document.createElement('h2');
  postsHeader.textContent = 'Posts';
  postsContainerInward.appendChild(postsHeader);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group');
  postsContainerInward.appendChild(postsList);

  state.posts.forEach((currentPost) => {
    const currentPostItem = document.createElement('li');
    currentPostItem.classList.add('list-group-item');

    const currentPostHref = document.createElement('a');
    currentPostHref.setAttribute('href', currentPost.postLink);
    currentPostHref.setAttribute('target', '_blank');
    currentPostHref.textContent = currentPost.postTitle;
    if (!currentPost.viewed) {
      currentPostHref.classList.add('font-weight-bold');
    }
    currentPostItem.appendChild(currentPostHref);
    currentPostHref.addEventListener('click', () => {
      const post = currentPost;
      post.viewed = true;
      currentPostHref.classList.replace('font-weight-bold', 'font-weight-normal');
    });
    const previewButton = document.createElement('button');
    previewButton.textContent = 'Preview';
    previewButton.classList.add('btn-primary', 'btn', 'btn-sm', 'float-right');
    previewButton.setAttribute('data-toggle', 'modal');
    previewButton.setAttribute('data-target', '#exampleModal');

    previewButton.addEventListener('click', () => {
      modalTitle.textContent = currentPost.postTitle;
      modalContent.textContent = currentPost.postDescription;
      const post = currentPost;
      post.viewed = true;
      currentPostHref.classList.replace('font-weight-bold', 'font-weight-normal');
      modalRedirectButton.href = currentPost.postLink;
    });
    currentPostItem.appendChild(previewButton);

    postsList.appendChild(currentPostItem);
  });
};

export { renderInputValid, renderError, renderOutput };
/*
import i18next from 'i18next';

const renderLayout = (state) => {
  const layout = document.querySelector('[id="layout"]');
  const modalTitle = document.querySelector('[class="modal-title"]');
  const modalContent = document.querySelector('[class="modal-body"]');
  const modalRedirectButton = document.querySelector('[id="redirectButton"]');

  const layoutCleaner = (node) => {
    if (node.hasChildNodes()) {
      node.childNodes.forEach((child) => {
        layoutCleaner(child);
      });
    }
    node.remove();
  };
  layout.childNodes.forEach((childNode) => {
    layoutCleaner(childNode);
  });

  const { childNodes } = layout;
  [...childNodes].forEach((childNode) => {
    layoutCleaner(childNode);
  });

  const feedsContainerCoat = document.createElement('div');
  feedsContainerCoat.classList.add('row');
  layout.appendChild(feedsContainerCoat);

  const feedsContainerInward = document.createElement('div');
  feedsContainerInward.classList.add('container-fluid', 'col-lg-10', 'mx-auto', 'feeds');
  feedsContainerCoat.appendChild(feedsContainerInward);

  const feedsHeader = document.createElement('h2');
  feedsHeader.textContent = 'Feeds';
  feedsContainerInward.appendChild(feedsHeader);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'mb-5');
  feedsContainerInward.appendChild(feedsList);

  state.layout.feeds.forEach((currentFeed) => {
    const currentFeedItem = document.createElement('li');
    currentFeedItem.classList.add('list-group-item');

    const currentFeedHeader = document.createElement('h3');
    currentFeedHeader.textContent = currentFeed.streamTitle;
    currentFeedItem.appendChild(currentFeedHeader);

    const currentFeedDescription = document.createElement('p');
    currentFeedDescription.textContent = currentFeed.streamDescription;
    currentFeedItem.appendChild(currentFeedDescription);

    feedsList.appendChild(currentFeedItem);
  });

  const postsContainerCoat = document.createElement('div');
  postsContainerCoat.classList.add('row');
  layout.appendChild(postsContainerCoat);

  const postsContainerInward = document.createElement('div');
  postsContainerInward.classList.add('container-fluid', 'col-lg-10', 'mx-auto', 'posts');
  postsContainerCoat.appendChild(postsContainerInward);

  const postsHeader = document.createElement('h2');
  postsHeader.textContent = 'Posts';
  postsContainerInward.appendChild(postsHeader);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group');
  postsContainerInward.appendChild(postsList);

  state.layout.posts.forEach((currentPost) => {
    const currentPostItem = document.createElement('li');
    currentPostItem.classList.add('list-group-item');

    const currentPostHref = document.createElement('a');
    currentPostHref.setAttribute('href', currentPost.postLink);
    currentPostHref.setAttribute('target', '_blank');
    currentPostHref.textContent = currentPost.postTitle;
    if (!currentPost.viewed) {
      currentPostHref.classList.add('font-weight-bold');
    }
    currentPostItem.appendChild(currentPostHref);
    currentPostHref.addEventListener('click', () => {
      const post = currentPost;
      post.viewed = true;
      currentPostHref.classList.replace('font-weight-bold', 'font-weight-normal');
    });
    const previewButton = document.createElement('button');
    previewButton.textContent = 'Preview';
    previewButton.classList.add('btn-primary', 'btn', 'btn-sm', 'float-right');
    previewButton.setAttribute('data-toggle', 'modal');
    previewButton.setAttribute('data-target', '#exampleModal');

    previewButton.addEventListener('click', () => {
      modalTitle.textContent = currentPost.postTitle;
      modalContent.textContent = currentPost.postDescription;
      const post = currentPost;
      post.viewed = true;
      currentPostHref.classList.replace('font-weight-bold', 'font-weight-normal');
      modalRedirectButton.href = currentPost.postLink;
    });
    currentPostItem.appendChild(previewButton);

    postsList.appendChild(currentPostItem);
  });
};

const feedbackDanger = document.querySelector('[class="feedback text-danger"]');
const successMessage = document.querySelector('[class="feedback text-success"]');

const renderInputError = (errorName) => {
  feedbackDanger.textContent = !(errorName === '') ? i18next.t(`errors.input.${errorName}`) : '';
};

const renderFeedError = (errorName) => {
  feedbackDanger.textContent = !(errorName === '') ? i18next.t(`errors.feed.${errorName}`) : '';
};

const renderSuccessMessage = (messageName) => {
  successMessage.textContent = !(messageName === '') ? i18next.t(`messages.${messageName}`) : '';
};

export {
  renderLayout, renderInputError, renderFeedError, renderSuccessMessage,
};
*/