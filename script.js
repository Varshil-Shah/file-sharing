const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('.browseButton');

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
  const percentage = Math.round((e.loaded / e.total) * 100);
  console.log(percentage);
};

const uploadFile = () => {
  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append('myfile', file);

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      console.log(xhr.response);
    }
  };

  xhr.upload.onprogress = updateProgress;

  xhr.open('POST', uploadUrl, true);
  xhr.send(formData);
};

fileInput.addEventListener('change', uploadFile);
