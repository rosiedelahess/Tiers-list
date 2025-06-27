const imageUpload = document.getElementById('image-upload');
const imageTitle = document.getElementById('image-title');
const addElementBtn = document.getElementById('add-element');
const rankInputs = document.querySelectorAll('#rank-names input');

let storageArea = document.getElementById('storage-area');
if (!storageArea) {
  storageArea = document.createElement('section');
  storageArea.id = 'storage-area';
  storageArea.className = 'tier';
  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = 'En attente';
  const content = document.createElement('div');
  content.className = 'tier-content';
  storageArea.appendChild(label);
  storageArea.appendChild(content);
  document.body.insertBefore(storageArea, document.getElementById('tier-list'));
}

// Update rank labels
rankInputs.forEach(input => {
  input.addEventListener('input', () => {
    const rank = input.dataset.rank;
    const tier = document.querySelector(`.tier[data-rank="${rank}"]`);
    if (tier) {
      tier.querySelector('.label').textContent = input.value;
    }
  });
});

addElementBtn.addEventListener('click', () => {
  const title = imageTitle.value.trim();

  if (!title && !imageUpload.files.length) {
    alert("Ajoute au moins un titre ou une image.");
    return;
  }

  const reader = new FileReader();
  const element = createElement('', title);

  if (imageUpload.files.length > 0) {
    const file = imageUpload.files[0];
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = title || '';
      element.insertBefore(img, element.firstChild);
      addToStorage(element);
      saveTierList();
    };
    reader.readAsDataURL(file);
  } else {
    addToStorage(element);
    saveTierList();
  }

  imageUpload.value = '';
  imageTitle.value = '';
});

function createElement(imgSrc, title) {
  const element = document.createElement('div');
  element.className = 'element';
  element.draggable = true;

  element.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', '');
    element.classList.add('dragging');
  });

  element.addEventListener('dragend', () => {
    element.classList.remove('dragging');
    saveTierList();
  });

  if (imgSrc) {
    const img = document.createElement('img');
    img.src = imgSrc;
    element.appendChild(img);
  }

  if (title) {
    const titleDiv = document.createElement('div');
    titleDiv.textContent = title;
    element.appendChild(titleDiv);
  }

  return element;
}

function addToStorage(element) {
  const content = document.querySelector('#storage-area .tier-content');
  content.appendChild(element);
}

// Drag and drop into all tiers
document.querySelectorAll('.tier').forEach(tier => {
  const content = tier.querySelector('.tier-content') || tier;
  tier.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  tier.addEventListener('drop', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      content.appendChild(dragging);
      saveTierList();
    }
  });
});

// Save function
function saveTierList() {
  const tiers = document.querySelectorAll('.tier');
  const data = [];

  tiers.forEach(tier => {
    const rank = tier.dataset.rank || 'storage';
    const elements = tier.querySelectorAll('.element');
    elements.forEach(el => {
      const img = el.querySelector('img');
      const title = el.querySelector('div')?.textContent || '';
      data.push({
        rank,
        title,
        img: img ? img.src : ''
      });
    });
  });

  localStorage.setItem('tierListData', JSON.stringify(data));
}

// Load function
function loadTierList() {
  const data = JSON.parse(localStorage.getItem('tierListData') || '[]');
  data.forEach(item => {
    const el = createElement(item.img, item.title);
    const targetTier = document.querySelector(`.tier[data-rank="${item.rank}"]`) ||
                       document.querySelector('#storage-area');
    const content = targetTier.querySelector('.tier-content') || targetTier;
    content.appendChild(el);
  });
}

loadTierList();
