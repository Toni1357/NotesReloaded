document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const status = document.getElementById('status-indicator');

  // Mise en forme
  document.querySelectorAll('[data-cmd]').forEach(button => {
    button.addEventListener('click', () => {
      const cmd = button.getAttribute('data-cmd');
      document.execCommand(cmd, false, null);
      editor.focus();
    });
  });

  // Nouvelle note
  document.getElementById('btn-new-note').addEventListener('click', () => {
    if (confirm("Créer une nouvelle note ? Le contenu actuel sera perdu.")) {
      editor.innerHTML = '';
    }
  });

  // Sauvegarde manuelle
  document.getElementById('btn-save').addEventListener('click', () => {
    localStorage.setItem('noteContent', editor.innerHTML);
    alert("Note sauvegardée !");
  });

  // Restauration
  const saved = localStorage.getItem('noteContent');
  if (saved) editor.innerHTML = saved;

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

let locked = false;
document.getElementById('btn-lock').addEventListener('click', () => {
  const pwd = prompt("Entrez un mot de passe pour verrouiller/déverrouiller");
  if (!pwd) return;
  locked = !locked;
  editor.contentEditable = !locked;
  alert(locked ? "Note verrouillée 🔒" : "Note déverrouillée 🔓");
});

document.getElementById('btn-darkmode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.getElementById('btn-export').addEventListener('click', () => {
  const content = editor.innerHTML;
  navigator.clipboard.writeText(content).then(() => {
    alert("Note copiée dans le presse-papiers 📋");
  });
});



