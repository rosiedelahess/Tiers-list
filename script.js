// === tierlist.js ===

// Sélection des éléments du DOM const imageUpload = document.getElementById('image-upload'); const imageTitle = document.getElementById('image-title'); const addElementBtn = document.getElementById('add-element'); const rankInputs = document.querySelectorAll('#rank-names input'); const downloadButton = document.getElementById("download-btn");

// Création ou récupération de la zone de stockage let storageArea = document.getElementById('storage-area'); if (!storageArea) { storageArea = document.createElement('section'); storageArea.id = 'storage-area'; storageArea.className = 'tier'; const label = document.createElement('span'); label.className = 'label'; label.textContent = 'En attente'; const content = document.createElement('div'); content.className = 'tier-content'; storageArea.appendChild(label); storageArea.appendChild(content); document.body.insertBefore(storageArea, document.getElementById('tier-list')); }

// Mise à jour dynamique des noms de rangs et sauvegarde rankInputs.forEach(input => { input.addEventListener('input', () => { const rank = input.dataset.rank; const tier = document.querySelector(.tier[data-rank="${rank}"]); if (tier) { tier.querySelector('.label').textContent = input.value; saveTierList(); } }); });

// Fonction pour créer un élément de la tier list function createElement(imageSrc, title) { const element = document.createElement("div"); element.classList.add("tier-item"); element.setAttribute("draggable", "true");

if (imageSrc) { const img = document.createElement("img"); img.src = imageSrc; img.alt = title; element.appendChild(img); }

if (title) { const caption = document.createElement("p"); caption.textContent = title; element.appendChild(caption); }

const deleteBtn = document.createElement("button"); deleteBtn.classList.add("delete-btn"); deleteBtn.textContent = "✖"; deleteBtn.addEventListener("click", () => { element.remove(); saveTierList(); }); element.appendChild(deleteBtn);

makeDraggable(element); return element; }

function addToStorage(element) { const content = document.querySelector('#storage-area .tier-content'); content.appendChild(element); }

// Ajout d’un élément par le bouton addElementBtn.addEventListener('click', () => { const title = imageTitle.value.trim(); if (!title && !imageUpload.files.length) { alert("Ajoute au moins un titre ou une image."); return; }

if (imageUpload.files.length > 0) { const reader = new FileReader(); reader.onload = (e) => { const element = createElement(e.target.result, title); addToStorage(element); saveTierList(); }; reader.readAsDataURL(imageUpload.files[0]); } else { const element = createElement('', title); addToStorage(element); saveTierList(); }

imageUpload.value = ''; imageTitle.value = ''; });

// Drag and drop function makeDraggable(el) { el.classList.add('draggable'); el.addEventListener("dragstart", () => el.classList.add("dragging")); el.addEventListener("dragend", () => el.classList.remove("dragging")); }

document.querySelectorAll('.tier').forEach(tier => { const content = tier.querySelector('.tier-content') || tier; tier.addEventListener('dragover', (e) => e.preventDefault()); tier.addEventListener('drop', (e) => { e.preventDefault(); const dragging = document.querySelector('.dragging'); if (dragging) { content.appendChild(dragging); saveTierList(); } }); });

// Sauvegarde dans localStorage function saveTierList() { const tiers = document.querySelectorAll('.tier'); const data = []; tiers.forEach(tier => { const rank = tier.dataset.rank || 'storage'; const label = tier.querySelector('.label')?.textContent || ''; const elements = tier.querySelectorAll('.tier-item'); elements.forEach(el => { const img = el.querySelector('img'); const title = el.querySelector('p')?.textContent || ''; data.push({ rank, label, title, img: img ? img.src : '' }); }); }); localStorage.setItem('tierListData', JSON.stringify(data)); }

// Chargement depuis localStorage function loadTierList() { const data = JSON.parse(localStorage.getItem('tierListData') || '[]'); const ranks = {}; data.forEach(item => { const tier = document.querySelector(.tier[data-rank="${item.rank}"]); if (tier && !ranks[item.rank]) { tier.querySelector('.label').textContent = item.label || item.rank; const input = document.querySelector(input[data-rank="${item.rank}"]); if (input) input.value = item.label || item.rank; ranks[item.rank] = true; } const el = createElement(item.img, item.title); const target = tier || document.querySelector('#storage-area'); const content = target.querySelector('.tier-content') || target; content.appendChild(el); }); }

document.addEventListener('DOMContentLoaded', loadTierList);

// Export en image if (downloadButton) { downloadButton.addEventListener("click", () => { const tierList = document.getElementById("tier-list"); html2canvas(tierList).then(canvas => { const link = document.createElement("a"); link.download = "ma-tier-list.png"; link.href = canvas.toDataURL("image/png"); link.click(); }); }); }

