/* eslint-disable no-param-reassign */
// const urlInput = document.getElementById('url-input');

// const feedback = document.querySelector('.feedback');

// const feedsContainer = document.querySelector('.feeds');
// const postsContainer = document.querySelector('.posts');

// const modal = new Modal(document.getElementById('modal'));
// const modalTitle = document.querySelector('.modal-title');
// const modalContent = document.querySelector('.modal-body');
// const modalRedirectButton = document.querySelector('.full-article');

const modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
modalCloseButtons.forEach((closeButton) => closeButton.addEventListener('click', () => {
  // modal.hide();
}));

const renderButton = (value, submitButton, urlInput) => {
  submitButton.disabled = value;
  urlInput.readOnly = value;
};

const renderInputValid = (valid, urlInput) => {
  if (valid) {
    urlInput.classList.remove('is-invalid');
  } else {
    urlInput.classList.add('is-invalid');
  }
};

const renderError = (errorType, i18nextInstance, feedback) => {
  if (errorType) {
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18nextInstance.t(`errors.${errorType}`);
  } else {
    feedback.textContent = '';
  }
};

const renderSuccess = (message, i18nextInstance, feedback, urlInput) => {
  if (message) {
    feedback.classList.replace('text-danger', 'text-success');
    feedback.textContent = i18nextInstance.t(`messages.${message}`);
    urlInput.value = '';
    urlInput.focus();
  }
};

const renderOutput = (
  state,
  i18nextInstance,
  feedsContainer,
  postsContainer,
  modalTitle,
  modalContent,
  modalRedirectButton,
  showModal,
) => {
  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

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
    const { title, description } = currentFeed;
    const currentFeedItem = document.createElement('li');
    currentFeedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const currentFeedHeader = document.createElement('h6');
    currentFeedHeader.classList.add('m-0');
    currentFeedHeader.textContent = title;
    currentFeedItem.appendChild(currentFeedHeader);

    const currentFeedDescription = document.createElement('p');
    currentFeedDescription.classList.add('m-0', 'text-black-50', 'small');
    currentFeedDescription.textContent = description;
    currentFeedItem.appendChild(currentFeedDescription);

    listOfFeeds.appendChild(currentFeedItem);
  });

  const postsOutward = document.createElement('div');
  postsOutward.classList.add('card', 'border-0');
  postsContainer.appendChild(postsOutward);

  const postsHeaderContainer = document.createElement('div');
  postsHeaderContainer.classList.add('card-body');
  postsOutward.appendChild(postsHeaderContainer);

  const postsHeader = document.createElement('h4');
  postsHeader.classList.add('card-title');
  postsHeader.textContent = i18nextInstance.t('output.posts');
  postsHeaderContainer.appendChild(postsHeader);

  const listOfPosts = document.createElement('ul');
  listOfPosts.classList.add('list-group', 'border-0', 'rounded-0');
  postsOutward.appendChild(listOfPosts);

  state.posts.forEach((currentPost) => {
    const {
      title, link, id,
    } = currentPost;
    const currentPostItem = document.createElement('li');
    currentPostItem.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );

    const currentPostHref = document.createElement('a');
    currentPostHref.setAttribute('href', link);
    currentPostHref.setAttribute('target', '_blank');
    currentPostHref.setAttribute('rel', 'noopener norefferer');
    currentPostHref.setAttribute('style', 'text-decoration: none');
    currentPostHref.dataset.id = id;
    currentPostHref.classList.add('fw-normal', 'link-secondery');
    currentPostHref.textContent = title;
    if (!state.viewedPostsId.has(id)) {
      currentPostHref.classList.add('fw-bold');
    }
    currentPostItem.appendChild(currentPostHref);

    const previewButton = document.createElement('button');
    previewButton.textContent = i18nextInstance.t('output.preview');
    previewButton.classList.add('btn-outline-primary', 'btn', 'btn-sm');
    previewButton.setAttribute('data-toggle', 'modal');
    previewButton.setAttribute('data-target', '#modal');
    previewButton.dataset.id = id;

    currentPostItem.appendChild(previewButton);
    listOfPosts.appendChild(currentPostItem);
  });
  listOfPosts.addEventListener('click', (e) => {
    console.log(e.target);
    const { id, toggle } = e.target.dataset;
    if (toggle === 'modal') {
      const [clickedPost] = state.posts.filter((post) => post.id === id);
      const { title, description, link } = clickedPost;
      modalTitle.textContent = title;
      modalContent.innerHTML = description;
      modalRedirectButton.href = link;
      showModal();
    }
  });
};

export {
  renderInputValid,
  renderError,
  renderSuccess,
  renderOutput,
  renderButton,
};
