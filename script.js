const imageUpload = document.getElementById('image-upload');
const imageTitle = document.getElementById('image-title');
const addElementBtn = document.getElementById('add-element');
const rankInputs = document.querySelectorAll('#rank-names input');

// Création de la zone de stockage si elle n'existe pas
let storageArea = document.getElementById('storage-area');
if (!storageArea) {
  storageArea = document.createElement('section');
  storageArea.id = 'storage-area';
  storageArea.className = 'tier';
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'En attente';
  storageArea.appendChild(label);
  const content = document.createElement('div');
  content.className = 'tier-content';
  storageArea.appendChild(content);
  document.body.insertBefore(storageArea, document.getElementById('tier-list'));
}

// Mettre à jour les labels des rangs quand on modifie les inputs
rankInputs.forEach(input => {
  input.addEventListener('input', () => {
    const rank = input.dataset.rank;
    const tier = document.querySelector(`.tier[data-rank="${rank}"]`);
    if (tier) {
      tier.querySelector('.label').textContent = input.value;
    }
  });
});

// Ajout d'un élément
addElementBtn.addEventListener('click', () => {
  const title = imageTitle.value.trim();

  if (!title && !imageUpload.files.length) {
    alert("Ajoute au moins un titre ou une image.");
    return;
  }

  const reader = new FileReader();
  const element = document.createElement('div');
  element.className = 'element';
  element.draggable = true;

  // Gestion du drag and drop
  element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '');
    element.classList.add('dragging');
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('dragging');
  });

  const titleDiv = document.createElement('div');
  titleDiv.textContent = title || '';
  element.appendChild(titleDiv);

  // Image facultative
  if (imageUpload.files.length > 0) {
    const file = imageUpload.files[0];
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      element.insertBefore(img, titleDiv);
      addToStorage(element);
    };
    reader.readAsDataURL(file);
  } else {
    addToStorage(element);
  }

  // Réinitialiser les champs
  imageUpload.value = '';
  imageTitle.value = '';
});

function addToStorage(element) {
  const content = document.querySelector('#storage-area .tier-content');
  content.appendChild(element);
}

// Gestion du drop dans chaque tier
document.querySelectorAll('.tier').forEach(tier => {
  const content = tier.querySelector('.tier-content');
  tier.addEventListener('dragover', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging && content) {
      content.appendChild(dragging);
    }
  });
});
