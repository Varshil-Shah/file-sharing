const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('.browseButton');

const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progress');
const percent = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const progressTitle = document.querySelector('.progress-title');

const sharingContainer = document.querySelector('.sharing-container');
const fileUrl = document.querySelector('#file-url');

const emailForm = document.querySelector('#email-form');
const toast = document.querySelector('.toast');

const maxAllowedSize = 50 * 1024 * 1024; // 50MB

const host = 'https://inshare-file-sharing-api.herokuapp.com';
const uploadUrl = `${host}/api/files`;
const emailUrl = `${host}/api/files/send`;

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragged');
});

dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('dragged');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragged');
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    uploadFile();
  }
});

browseButton.addEventListener('click', (e) => {
  fileInput.click();
});

const updateProgress = (e) => {
  const percentage = Math.floor((e.loaded / e.total) * 100);
  bgProgress.style.width = `${percentage + 0.5}%`;
  progressBar.style.width = `${percentage + 0.5}%`;
  if (percentage === 100) {
    progressTitle.textContent = 'Uploaded successfully';
  }
  percent.textContent = percentage;
};

let toastTimer;
const showToast = (message) => {
  toast.textContent = message;
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
};

const uploadFile = () => {
  // only one file at a time
  if (fileInput.files.length > 1) {
    fileInput.files = null;
    showToast('Please upload one file!');
    progressContainer.style.display = 'none';
    return;
  }

  progressContainer.style.display = 'block';
  const file = fileInput.files[0];

  // check file size is less than 10MB
  if (file.size > maxAllowedSize) {
    fileInput.files = null;
    showToast(`Can\'t upload more than ${maxAllowedSize / (1024 * 1024)}MB`);
    progressContainer.style.display = 'none';
    return;
  }

  const formData = new FormData();
  formData.append('myfile', file);

  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const data = JSON.parse(xhr.responseText);
      showLink(data);
    }
  };

  xhr.upload.onprogress = updateProgress;
  xhr.upload.onerror = () => {
    fileInput.value = '';
    showToast(`Error while uploading - ${xhr.statusText}`);
  };

  xhr.open('POST', uploadUrl, true);
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  xhr.send(formData);
};

const copyToClipboard = (value) => {
  fileUrl.select();
  document.execCommand('copy');
  showToast('Copied to clipboard');
};

fileUrl.addEventListener('click', copyToClipboard);

const showLink = ({ file: url }) => {
  emailForm[2].removeAttribute('disabled');
  fileInput.value = '';

  progressContainer.style.display = 'none';
  sharingContainer.style.display = 'block';
  fileUrl.value = url;
};

fileInput.addEventListener('change', uploadFile);

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const length = fileUrl.value.split('/').length;
  const uuid = fileUrl.value.split('/')[length - 1];

  const formData = {
    uuid,
    emailTo: emailForm.elements['senderEmail'].value,
    emailFrom: emailForm.elements['receiverEmail'].value,
  };

  emailForm[2].setAttribute('disabled', true);
  fetch(emailUrl, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      return res.json();
    })
    .then(({ success }) => {
      if (success) {
        sharingContainer.style.display = 'none';
        showToast('Email send!');
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
