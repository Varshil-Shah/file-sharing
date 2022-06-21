const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('.browseButton');

const host = 'https://innshare.herokuapp.com';
const uploadUrl = `${host}/api/files`;

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

fileInput.addEventListener('change', uploadFile);

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

  xhr.open('POST', uploadUrl, true);
  xhr.send(formData);
};
