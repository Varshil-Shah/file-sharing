const dropZone = document.querySelector('.drop-zone');
const fileInput = document.querySelector('#fileInput');
const browseButton = document.querySelector('.browseButton');

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
  }
});

browseButton.addEventListener('click', (e) => {
  fileInput.click();
});
