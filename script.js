const imageUpload = document.getElementById('image-upload');
const imageTitle = document.getElementById('image-title');
const addElementBtn = document.getElementById('add-element');
const rankInputs = document.querySelectorAll('#rank-names input');

// Met à jour les labels en direct
rankInputs.forEach(input => {
  input.addEventListener('input', () => {
    const rank = input.dataset.rank;
    const tier = document.querySelector(`.tier[data-rank="${rank}"]`);
    if (tier) {
      tier.querySelector('.label').textContent = input.value || rank;
      saveTierList();
    }
  });
});

// Crée un élément de tier list
function createElement(imageSrc, title) {
  const element = document.createElement("div");
  element.className = "tier-item";
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

  const del = document.createElement("button");
  del.textContent = "✖";
  del.className = "delete-btn";
  del.onclick = () => {
    element.remove();
    saveTierList();
  };

  element.appendChild(del);
  makeDraggable(element);
  return element;
}

// Ajoute un élément
addElementBtn.addEventListener('click', () => {
  const title = imageTitle.value.trim();

  if (!title && !imageUpload.files.length) {
    alert("Ajoute au moins une image ou un titre.");
    return;
  }

  if (imageUpload.files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const element = createElement(e.target.result, title);
      document.querySelector('#storage-area .tier-content').appendChild(element);
      saveTierList();
    };
    reader.readAsDataURL(imageUpload.files[0]);
  } else {
    const element = createElement('', title);
    document.querySelector('#storage-area .tier-content').appendChild(element);
    saveTierList();
  }

  imageUpload.value = '';
  imageTitle.value = '';
});

// Drag & drop
function makeDraggable(el) {
  el.addEventListener("dragstart", () => el.classList.add("dragging"));
  el.addEventListener("dragend", () => el.classList.remove("dragging"));
}

document.querySelectorAll('.tier').forEach(tier => {
  tier.addEventListener('dragover', (e) => e.preventDefault());
  tier.addEventListener('drop', (e) => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const content = tier.querySelector('.tier-content');
    if (dragging && content) {
      content.appendChild(dragging);
      saveTierList();
    }
  });
});

// Sauvegarde automatique
function saveTierList() {
  const tiers = document.querySelectorAll('.tier');
  const data = [];

  tiers.forEach(tier => {
    const rank = tier.dataset.rank || 'storage';
    const label = tier.querySelector('.label')?.textContent || rank;
    const elements = tier.querySelectorAll('.tier-item');

    elements.forEach(el => {
      const img = el.querySelector('img');
      const title = el.querySelector('p')?.textContent || '';
      data.push({
        rank,
        label,
        title,
        img: img ? img.src : ''
      });
    });
  });

  localStorage.setItem('tierListData', JSON.stringify(data));
}

// Chargement auto
function loadTierList() {
  const data = JSON.parse(localStorage.getItem('tierListData') || '[]');

  data.forEach(item => {
    const el = createElement(item.img, item.title);
    const targetTier = document.querySelector(`.tier[data-rank="${item.rank}"]`);
    const content = targetTier ? targetTier.querySelector('.tier-content') : document.querySelector('#storage-area .tier-content');
    content.appendChild(el);

    // Met à jour le label
    if (targetTier && item.label) {
      targetTier.querySelector('.label').textContent = item.label;
    }
  });
}

document.addEventListener('DOMContentLoaded', loadTierList);

// Télécharger en image
document.getElementById("download-btn").addEventListener("click", () => {
  const tierList = document.getElementById("tier-list");
  html2canvas(tierList).then(canvas => {
    const link = document.createElement("a");
    link.download = "ma-tier-list.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
});
