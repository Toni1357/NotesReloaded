document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const status = document.getElementById('status-indicator');

  // ✅ Mise en forme
  document.querySelectorAll('[data-cmd]').forEach(button => {
    button.addEventListener('click', () => {
      const cmd = button.getAttribute('data-cmd');
      const value = button.getAttribute('data-value') || null;
      document.execCommand(cmd, false, value);
      editor.focus();
    });
  });

  // ✅ Menu déroulant pour les titres
  const headingSelect = document.getElementById('heading-select');
  if (headingSelect) {
    headingSelect.addEventListener('change', () => {
      const value = headingSelect.value;
      if (value) {
        document.execCommand('formatBlock', false, value);
        editor.focus();
      }
    });
  }

  // ✅ Sauvegarde 📋
  document.getElementById('btn-save').textContent = '📋';
  document.getElementById('btn-save').addEventListener('click', () => {
    localStorage.setItem('noteContent', editor.innerHTML);
    alert("Note sauvegardée !");
  });

  // ✅ Suppression 🗑️
  document.getElementById('btn-delete').textContent = '🗑️';
  document.getElementById('btn-delete').addEventListener('click', () => {
    if (confirm("Supprimer cette note ?")) {
      editor.innerHTML = '';
      localStorage.removeItem('noteContent');
    }
  });

  // ✅ Exportation 📤
  document.getElementById('btn-export').textContent = '📤';
  document.getElementById('btn-export').addEventListener('click', () => {
    const content = editor.innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'note.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  // ✅ Nouvelle note
  document.getElementById('btn-new-note').addEventListener('click', () => {
    if (confirm("Créer une nouvelle note ? Le contenu actuel sera perdu.")) {
      editor.innerHTML = '';
    }
  });

  // ✅ Chargement automatique
  const saved = localStorage.getItem('noteContent');
  if (saved) editor.innerHTML = saved;

  // ✅ Indicateur de connexion
  function updateStatus() {
    status.textContent = navigator.onLine ? '🟢 En ligne' : '🔴 Hors ligne';
  }
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
  updateStatus();

  // ✅ Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.error('❌ Échec SW:', err));
  }

  // ✅ Verrouillage
  let locked = false;
  document.getElementById('btn-lock').addEventListener('click', () => {
    const pwd = prompt("Mot de passe pour verrouiller/déverrouiller");
    if (!pwd) return;
    locked = !locked;
    editor.contentEditable = !locked;
    alert(locked ? "Note verrouillée 🔒" : "Note déverrouillée 🔓");
  });

  // ✅ Sidebar togglable ☰
const toggleSidebar = document.getElementById('toggle-sidebar');
const backdrop = document.getElementById('backdrop');

toggleSidebar.addEventListener('click', () => {
  document.body.classList.toggle('sidebar-open');
});

backdrop.addEventListener('click', () => {
  document.body.classList.remove('sidebar-open');
});


