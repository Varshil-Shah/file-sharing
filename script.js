const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('.browseButton');

const progressContainer = document.querySelector('.progress-container');
const bgProgress = document.querySelector('.bg-progress');
const percent = document.querySelector('#percent');
const progressBar = document.querySelector('.progress-bar');
const progressTitle = document.querySelector('.progress-title');

const host = 'https://innshare.herokuapp.com';
const uploadUrl = `https://reqres.in/api/users`;

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
      showLink({ file: 'File Name', link: 'https://google.com/api' });
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open('POST', uploadUrl, true);
  xhr.send(formData);
};

const showLink = ({ link }) => {
  progressContainer.style.display = 'none';
  console.log(link);
};

fileInput.addEventListener('change', uploadFile);
