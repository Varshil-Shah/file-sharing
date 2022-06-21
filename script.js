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
const copyButton = document.querySelector('#copy-button');

const host = 'https://innshare.herokuapp.com';
const uploadUrl = `https://reqres.in/api/users`;
const dummyUrl =
  'https://innshare.herokuapp.com/files/a695f6ab-3234-49ec-b16b-61444060a92c';

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
  console.table(files);
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

const uploadFile = () => {
  progressContainer.style.display = 'block';
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('myfile', file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
      showLink({ file: 'File Name', link: dummyUrl });
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open('POST', uploadUrl, true);
  xhr.send(formData);
};

const showLink = ({ link }) => {
  progressContainer.style.display = 'none';
  sharingContainer.style.display = 'block';
  fileUrl.value = link;
};

fileInput.addEventListener('change', uploadFile);
