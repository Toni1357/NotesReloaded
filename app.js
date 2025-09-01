// Sélection des éléments
const editor = document.getElementById("editor");
const toolbarButtons = document.querySelectorAll(".toolbar button[data-cmd]");
const headingSelect = document.getElementById("heading-select");
const btnSave = document.getElementById("btn-save");
const btnDelete = document.getElementById("btn-delete");
const btnExport = document.getElementById("btn-export");
const statusIndicator = document.getElementById("status-indicator");

// ✅ Mise en forme (gras, italique, etc.)
toolbarButtons.forEach(button => {
  button.addEventListener("click", () => {
    const cmd = button.getAttribute("data-cmd");
    const value = button.getAttribute("data-value") || null;
    document.execCommand(cmd, false, value);
    editor.focus();
  });
});

// ✅ Format de titre (H1, H2, H3)
headingSelect.addEventListener("change", () => {
  const value = headingSelect.value;
  if (value) {
    document.execCommand("formatBlock", false, value);
    editor.focus();
  }
});

// ✅ Sauvegarde locale
btnSave.addEventListener("click", () => {
  const content = editor.innerHTML;
  localStorage.setItem("note-content", content);
  alert("Note sauvegardée !");
});

// ✅ Suppression
btnDelete.addEventListener("click", () => {
  if (confirm("Supprimer cette note ?")) {
    editor.innerHTML = "";
    localStorage.removeItem("note-content");
  }
});

// ✅ Export en fichier texte
btnExport.addEventListener("click", () => {
  const content = editor.innerText;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "note.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// ✅ Chargement de la note sauvegardée
window.addEventListener("load", () => {
  const saved = localStorage.getItem("note-content");
  if (saved) {
    editor.innerHTML = saved;
  }
});

// ✅ Indicateur de connexion (mode hors ligne)
function updateOnlineStatus() {
  statusIndicator.textContent = navigator.onLine ? "🟢 En ligne" : "🔴 Hors ligne";
}
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
updateOnlineStatus();

// ✅ Service Worker pour PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js").then(() => {
    console.log("✅ Service Worker enregistré");
  }).catch(err => {
    console.error("❌ Service Worker erreur :", err);
  });
}
