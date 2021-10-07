import { Modal } from 'bootstrap';

const urlInput = document.getElementById('url-input');
const feedback = document.querySelector('.feedback');
const submitButton = document.querySelector('[type="submit"]');

const renderButton = (value) => {
  submitButton.disabled = value;
  urlInput.readOnly = value;
};

const renderInputValid = (valid) => {
  if (valid) {
    urlInput.classList.remove('is-invalid');
  } else {
    urlInput.classList.add('is-invalid');
  }
};

const renderError = (errorType, i18nextInstance) => {
  if (errorType) {
    feedback.classList.replace('text-success', 'text-danger');
    feedback.textContent = i18nextInstance.t(`errors.${errorType}`);
  } else {
    feedback.textContent = '';
  }
  console.log(feedback);
};

const renderSuccess = (message, i18nextInstance) => {
  if (message) {
    feedback.classList.replace('text-danger', 'text-success');
    feedback.textContent = i18nextInstance.t(`messages.${message}`);
    urlInput.value = '';
    urlInput.focus();
  }
};

const renderOutput = (state, i18nextInstance) => {
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  const modal = new Modal(document.getElementById('modal'));
  const modalTitle = document.querySelector('.modal-title');
  const modalContent = document.querySelector('.modal-body');
  const modalRedirectButton = document.querySelector('.full-article');

  const modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
  modalCloseButtons.forEach((closeButton) => closeButton.addEventListener('click', () => {
    modal.hide();
  }));

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
    currentPostHref.setAttribute('href', currentPost.postLink);
    currentPostHref.setAttribute('target', '_blank');
    currentPostHref.setAttribute('rel', 'noopener norefferer');
    currentPostHref.setAttribute('style', 'text-decoration: none');
    currentPostHref.setAttribute('data-id', `${currentPost.id}`);
    currentPostHref.classList.add('fw-normal', 'link-secondery');
    currentPostHref.textContent = currentPost.postTitle;
    if (!currentPost.viewed) {
      currentPostHref.classList.add('fw-bold');
    }
    currentPostItem.appendChild(currentPostHref);
    currentPostHref.addEventListener('click', () => {
      currentPostHref.classList.replace('fw-bold', 'fw-normal');
    });

    const previewButton = document.createElement('button');
    previewButton.textContent = i18nextInstance.t('output.preview');
    previewButton.classList.add('btn-outline-primary', 'btn', 'btn-sm');
    previewButton.setAttribute('data-toggle', 'modal');
    previewButton.setAttribute('data-target', '#modal');
    previewButton.setAttribute('data-id', `${currentPost.id}`);

    previewButton.addEventListener('click', () => {
      modalTitle.textContent = currentPost.postTitle;
      modalContent.innerHTML = currentPost.postDescription;
      currentPostHref.classList.replace('fw-bold', 'fw-normal');
      modalRedirectButton.href = currentPost.postLink;

      modal.show();
    });
    currentPostItem.appendChild(previewButton);

    listOfPosts.appendChild(currentPostItem);
  });
};

export {
  renderInputValid,
  renderError,
  renderSuccess,
  renderOutput,
  renderButton,
};
