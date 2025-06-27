// Sélection des éléments du DOM
const imageUpload = document.getElementById('image-upload');
const imageTitle = document.getElementById('image-title');
const addElementBtn = document.getElementById('add-element');
const rankInputs = document.querySelectorAll('#rank-names input');

// Création ou récupération de la zone de stockage
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

// Mise à jour des labels de rang dynamiquement
rankInputs.forEach(input => {
  input.addEventListener('input', () => {
    const rank = input.dataset.rank;
    const tier = document.querySelector(`.tier[data-rank="${rank}"]`);
    if (tier) {
      tier.querySelector('.label').textContent = input.value;
    }
  });
});

// Fonction pour créer un élément visuel
function createElement(imageSrc, title) {
  const element = document.createElement("div");
  element.classList.add("tier-item");
  element.setAttribute("draggable", "true");

  if (imageSrc) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = title;
    element.appendChild(img);
  }

  if (title) {
    const caption = document.createElement("p");
    caption.textContent = title;
    element.appendChild(caption);
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "✖";
  deleteBtn.addEventListener("click", () => {
    element.remove();
    saveTierList();
  });

  element.appendChild(deleteBtn);
  makeDraggable(element);
  return element;
}

// Ajout d’un élément dans la zone d’attente
function addToStorage(element) {
  const content = document.querySelector('#storage-area .tier-content');
  content.appendChild(element);
}

// Ajout via bouton
addElementBtn.addEventListener('click', () => {
  const title = imageTitle.value.trim();
  if (!title && !imageUpload.files.length) {
    alert("Ajoute au moins un titre ou une image.");
    return;
  }

  const reader = new FileReader();
  if (imageUpload.files.length > 0) {
    const file = imageUpload.files[0];
    reader.onload = (e) => {
      const element = createElement(e.target.result, title);
      addToStorage(element);
      saveTierList();
    };
    reader.readAsDataURL(file);
  } else {
    const element = createElement('', title);
    addToStorage(element);
    saveTierList();
  }

  imageUpload.value = '';
  imageTitle.value = '';
});

// Drag & drop
function makeDraggable(el) {
  el.classList.add('draggable');
  el.addEventListener("dragstart", () => el.classList.add("dragging"));
  el.addEventListener("dragend", () => el.classList.remove("dragging"));
}

document.querySelectorAll('.tier').forEach(tier => {
  const content = tier.querySelector('.tier-content') || tier;
  tier.addEventListener('dragover', (e) => e.preventDefault());
  tier.addEventListener('drop', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    if (dragging) {
      content.appendChild(dragging);
      saveTierList();
    }
  });
});

// Sauvegarde
function saveTierList() {
  const tiers = document.querySelectorAll('.tier');
  const data = [];
  tiers.forEach(tier => {
    const rank = tier.dataset.rank || 'storage';
    const elements = tier.querySelectorAll('.tier-item');
    elements.forEach(el => {
      const img = el.querySelector('img');
      const title = el.querySelector('p')?.textContent || '';
      data.push({
        rank,
        title,
        img: img ? img.src : ''
      });
    });
  });
  localStorage.setItem('tierListData', JSON.stringify(data));
}

// Chargement
function loadTierList() {
  const data = JSON.parse(localStorage.getItem('tierListData') || '[]');
  data.forEach(item => {
    const el = createElement(item.img, item.title);
    const targetTier = document.querySelector(`.tier[data-rank="${item.rank}"]`) || document.querySelector('#storage-area');
    const content = targetTier.querySelector('.tier-content') || targetTier;
    content.appendChild(el);
  });
}

document.addEventListener('DOMContentLoaded', loadTierList);

// Export image
const downloadButton = document.getElementById("download-btn");
downloadButton?.addEventListener("click", () => {
  const tierList = document.getElementById("tier-list");
  html2canvas(tierList).then(canvas => {
    const link = document.createElement("a");
    link.download = "ma-tier-list.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
