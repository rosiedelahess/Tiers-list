document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-element');
  const imageInput = document.getElementById('image-upload');
  const titleInput = document.getElementById('image-title');
  const tierList = document.getElementById('tier-list');
  
  addBtn.addEventListener('click', () => {
    const file = imageInput.files[0];
    const title = titleInput.value.trim();

    if (!file) {
      alert("Merci de choisir une image.");
      return;
    }
    if (!title) {
      alert("Merci d'entrer un nom pour l’élément.");
      return;
    }

    // Pour savoir dans quelle tier ajouter, on demande le rang aux inputs modifiables
    // Ici, on peut demander à l’utilisateur où il veut ajouter, ou par défaut on peut choisir S (à adapter selon ta UX)
    // Sinon, on peut prendre la valeur du premier input rang dans #rank-names, mais ça fait pas sens...
    // Donc on peut créer un select pour le rang, mais tu n'en as pas. Je vais supposer S pour l'exemple.

    // Si tu veux, je peux te faire un select rang, sinon, par défaut on met en S

    const rank = prompt("Dans quel rang voulez-vous ajouter cet élément ? (S, A, B, C, D)").toUpperCase();

    if (!['S', 'A', 'B', 'C', 'D'].includes(rank)) {
      alert("Rang invalide. Choisissez parmi S, A, B, C ou D.");
      return;
    }

    // Trouver la div tier correspondant au rang
    const tierDiv = tierList.querySelector(`.tier[data-rank="${rank}"]`);

    if (!tierDiv) {
      alert("Erreur : Rang introuvable.");
      return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
      // Création de l’élément visuel
      const elemDiv = document.createElement('div');
      elemDiv.classList.add('element');
      elemDiv.innerHTML = `
        <img src="${e.target.result}" alt="${title}" />
        <div class="element-name">${title}</div>
      `;

      tierDiv.appendChild(elemDiv);

      // Reset des inputs
      imageInput.value = '';
      titleInput.value = '';
    };

    reader.readAsDataURL(file);
  });
});
