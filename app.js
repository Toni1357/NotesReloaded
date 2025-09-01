document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');

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

  // Sauvegarde automatique
  setInterval(() => {
    localStorage.setItem('noteContent', editor.innerHTML);
  }, 5000);

  // Restauration
  const saved = localStorage.getItem('noteContent');
  if (saved) editor.innerHTML = saved;

  // Enregistrement du Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.error('❌ Échec SW:', err));
  }
});
