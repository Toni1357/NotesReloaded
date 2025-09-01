document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const status = document.getElementById('status-indicator');

  // Formatage
  document.querySelectorAll('[data-cmd]').forEach(button => {
    button.addEventListener('click', () => {
      const cmd = button.getAttribute('data-cmd');
      const value = button.getAttribute('data-value') || null;
      document.execCommand(cmd, false, value);
      editor.focus();
    });
  });

  // Nouvelle note
  document.getElementById('btn-new-note').addEventListener('click', () => {
    if (confirm("Créer une nouvelle note ? Le contenu actuel sera perdu.")) {
      editor.innerHTML = '';
    }
  });

  // Sauvegarde
  document.getElementById('btn-save').addEventListener('click', () => {
    localStorage.setItem('noteContent', editor.innerHTML);
    alert("Note sauvegardée !");
  });

  // Suppression
  document.getElementById('btn-delete').addEventListener('click', () => {
    if (confirm("Supprimer la note actuelle ?")) {
      editor.innerHTML = '';
      localStorage.removeItem('noteContent');
      alert("Note supprimée.");
    }
  });

  // Exportation
  document.getElementById('btn-export').addEventListener('click', () => {
    navigator.clipboard.writeText(editor.innerText).then(() => {
      alert("Note copiée dans le presse-papiers 📋");
    });
  });

  // Mode sombre
  document.getElementById('btn-darkmode').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  // Verrouillage
  let locked = false;
  document.getElementById('btn-lock').addEventListener('click', () => {
    const pwd = prompt("Mot de passe pour verrouiller/déverrouiller");
    if (!pwd) return;
    locked = !locked;
    editor.contentEditable = !locked;
    alert(locked ? "Note verrouillée 🔒" : "Note déverrouillée 🔓");
  });

  // Restauration
  const saved = localStorage.getItem('noteContent');
  if (saved) editor.innerHTML = saved;

  // Sauvegarde automatique
  setInterval(() => {
    localStorage.setItem('noteContent', editor.innerHTML);
  }, 30000);

  // Indicateur de connexion
  function updateStatus() {
    status.textContent = navigator.onLine ? '🟢 En ligne' : '🔴 Hors ligne';
  }
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();

  // Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.error('❌ Échec SW:', err));
  }
});
