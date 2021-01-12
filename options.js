window.onload = () => {

  restore_options();
  const instance = document.getElementById('instance');
  instance.addEventListener("change", verifyInstance);

  const button = document.getElementById('save');
  button.addEventListener("click", function () {
    saveOptions(instance.value);
  });
}


function verifyInstance(_arg) {
  let value = typeof _arg === 'object' ? _arg.srcElement.value : _arg;
  const tokenSection = document.getElementById('token-section');
  if (value === 'QA') {
    const tokenField = document.getElementById('tokenField');
    const qaToken = window.localStorage.getItem('qaToken');
    tokenSection.style.display = 'block';
    tokenField.value = qaToken;
  }
  else {
    tokenSection.style.display = 'none';
  }
}

function saveOptions(value) {
  if (value === 'QA') {
    const qaToken = document.getElementById('tokenField').value;
    window.localStorage.setItem("instance", "QA");
    window.localStorage.setItem("qaToken", qaToken);
    updateConfirmation();
  }
  else {
    window.localStorage.setItem("instance", "Live");
    updateConfirmation();
  }
  setAPIBranch();
}

function setAPIBranch() {
  const setAPIInstance = document.getElementById('apiCheck');
  activateRedirects(setAPIInstance.checked);

  const branchName = document.getElementById('branch-name');
  if (branchName.value !== '') {
    window.localStorage.setItem("apiBranch", branchName.value);
  }
  else {
    window.localStorage.removeItem("apiBranch");
  }
}

function updateConfirmation() {
  const status = document.getElementById('status');
  status.style.textAlign = 'center'
  status.innerText = 'Successfully saved instance'
  status.style.display = 'block';

  setTimeout(function () {
    status.style.display = 'none';
    status.innerText = '';
  },1000)
}

function restore_options() {
  const savedInstance = window.localStorage.getItem('instance');
  const savedAPIBranch = window.localStorage.getItem('apiBranch');
  const redirects = window.localStorage.getItem('redirect');

  if (savedInstance === 'Live') {
    document.getElementById('instance').value = savedInstance;
  }
  else if (savedInstance === 'QA') {
    verifyInstance(savedInstance);
    const qaToken = window.localStorage.getItem('qaToken');
    document.getElementById('instance').value = savedInstance;
    document.getElementById('tokenField').value = qaToken;
  }

  if (savedAPIBranch !== null && savedAPIBranch !== '') {
    document.getElementById('branch-name').value = savedAPIBranch;
  }

  if (redirects) {
    document.getElementById('apiCheck').checked = true;
  }


}

function activateRedirects(activate_boolean) {
  if (activate_boolean) {
    window.localStorage.setItem("redirect", true);
  }
  else {
    window.localStorage.removeItem("redirect");
  }
}