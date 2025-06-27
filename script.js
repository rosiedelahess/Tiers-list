const ranks = ["S", "A", "B", "C", "D"];
let tierNames = [...ranks];

function updateRankLabels() {
  const tierContainers = document.querySelectorAll('.tier');
  tierContainers.forEach((container, index) => {
    const label = container.querySelector('.label');
    label.textContent = tierNames[index];
  });
}

function handleRankInputChange(index, value) {
  tierNames[index] = value || ranks[index];
  updateRankLabels();
}

document.addEventListener("DOMContentLoaded", () => {
  const rankInputs = document.querySelectorAll('#rank-names input');
  rankInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => handleRankInputChange(index, e.target.value));
  });

  const dropzones = document.querySelectorAll('.tier');
  dropzones.forEach(zone => {
    zone.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("dragover");
    });

    zone.addEventListener("dragleave", () => {
      zone.classList.remove("dragover");
    });

    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("dragover");
      const data = e.dataTransfer.getData("text/plain");
      const dragged = document.getElementById(data);
      zone.appendChild(dragged);
    });
  });

  document.getElementById("add-image").addEventListener("click", () => {
    const input = document.getElementById("image-upload");
    const titleInput = document.getElementById("image-title");
    const files = input.files;
    if (!files.length) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const container = document.createElement("div");
        container.classList.add("item");
        container.setAttribute("draggable", "true");
        container.id = `item-${Date.now()}-${idx}`;
        container.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", container.id);
        });

        const img = document.createElement("img");
        img.src = e.target.result;

        const caption = document.createElement("div");
        caption.textContent = titleInput.value || "Sans titre";

        container.appendChild(img);
        container.appendChild(caption);
        document.querySelector('.tier[data-rank="D"]').appendChild(container);
      };
      reader.readAsDataURL(file);
    });
  });

  document.getElementById("download-btn").addEventListener("click", () => {
    const node = document.querySelector(".tier-list");
    html2canvas(node).then(canvas => {
      const link = document.createElement("a");
      link.download = "tierlist.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });
});
