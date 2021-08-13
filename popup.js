window.onload = () => {
  const instanceDetails = verifyInstance();
  const submitButton = document.getElementById('submit')
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    clearListItems();
    getSites(instanceDetails);
  })
}


function clearListItems() {
  let listItemCollections = document.body.getElementsByTagName('li');
  while (listItemCollections.length > 0) {
    for (let listItem of listItemCollections) {
      listItem.remove();
    }
  }
}

function contentLoading(isLoading) {
  let loadingSpinner = document.getElementById('spinner')
  let content = document.getElementById('content');
  if (isLoading) {
    content.style.display = 'none'
    loadingSpinner.style.display = 'block';
  }
  else {
    loadingSpinner.style.display = 'none';
    content.style.display = 'block';
  }
}

function appendListItems(resData) {
  handleMetaData(resData);

  for (const data of resData.data) {
    let content = document.getElementById('content');
    let new_list_item = document.createElement('li')
    new_list_item.innerText = `${data.name} | ${data.service} | ${data.id}`;
    new_list_item.className = 'list-group-item';
    new_list_item.style.padding = 2;
    content.appendChild(new_list_item);
  }
}

function handleMetaData(resData) {
  let recordCount = document.getElementById('record-count');
  recordCount.innerText = ' Total Matches Found: ' + resData.meta.totalItemCount;
}

function handleError(message) {
  let error = document.getElementById('error');
  error.innerText = message;
  error.style.display = 'block';

}

function clearError() {
  let error = document.getElementById('error');
  error.style.display = 'none';
}

function processGetRequestInputs(instanceDetail) {
  let siteName = document.getElementById('site-name').value;
  let service = document.getElementById('service').value;
  let status = document.getElementById('status').value;

  let requestURL = `https://${instanceDetail.domain}/sites?include=users&filter[name]=~${siteName}&page[number]=1&sort=-updatedAt&page[size]=5000`;

  if (service !== 'All') {
    requestURL = requestURL + '&filter[service]=' + service;
  };

  if (status !== '' && status !== null) {
    requestURL = requestURL + '&filter[status]=' + status;
  };
  
  return requestURL;
}

function verifyInstance() {
  let instanceDetails = {
    key: '',
    domain: '',
    instance: window.localStorage.getItem('instance'),
    redirection: window.localStorage.getItem('redirect')
  };
  if (instanceDetails.redirection !== null) {
    let redirectFlag = document.getElementById('redirect-flag');
    redirectFlag.style.color = 'rgb(135, 207, 76)';
    redirectFlag.innerText = 'Redirection ON';
  }


  const instance = instanceDetails.instance;
  if (instance === 'QA') {
    instanceDetails.key = 'qaToken';
    instanceDetails.domain = 'develop.api.dev.adthrive.com';

    const heading = document.getElementById('nav-brand');
    const spanInstance = document.createElement('span');
    spanInstance.style.color = 'rgb(135, 207, 76)';
    spanInstance.innerText = ' [QA INSTANCE]';
    heading.appendChild(spanInstance);
    return instanceDetails;
  }
  else {
    instanceDetails.key = 'token';
    instanceDetails.domain = 'publisher-api.adthrive.com';
    return instanceDetails;
  }
}


function getSites(instanceDetail) {
  clearError();
  const token = window.localStorage.getItem(instanceDetail.key);
  if (token === null) {
    handleError('Failed to authenticate. Please provide a valid token or login: https://publisher.adthrive.com/login')
    return;
  }

  const requestURL = processGetRequestInputs(instanceDetail);

  const request = new XMLHttpRequest();
  request.open("GET", requestURL, true)
  request.setRequestHeader('authorization', `Bearer ${token}`)

  request.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      resData = JSON.parse(this.response);
      appendListItems(resData);
      contentLoading(false);
    }
    else if (this.readyState === XMLHttpRequest.DONE && this.status === 401) {
      handleError('The token provided is invalid. Please update the current token');
      contentLoading(false);
    }
    else if (this.readyState === XMLHttpRequest.DONE) {
      handleError('There was an error processing your submission');
      contentLoading(false);
    }
  }
  request.send(null);
  contentLoading(true);
}
