document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor');
  const status = document.getElementById('status-indicator');
  const noteList = document.getElementById('note-list');
  const sidebar = document.getElementById('sidebar');
  const toggleSidebar = document.getElementById('toggle-sidebar');

  let notes = JSON.parse(localStorage.getItem('notes')) || [];
  let currentNoteId = null;

  function renderNotes() {
    noteList.innerHTML = '';
    notes.forEach((note, index) => {
      const li = document.createElement('li');
      li.textContent = note.title || `Note ${index + 1}`;
      li.addEventListener('click', () => {
        currentNoteId = index;
        editor.innerHTML = note.content;
        sidebar.classList.remove('open');
      });
      noteList.appendChild(li);
    });
  }

  function saveCurrentNote() {
    if (currentNoteId === null) {
      currentNoteId = notes.length;
      notes.push({ title: `Note ${notes.length + 1}`, content: editor.innerHTML });
    } else {
      notes[currentNoteId].content = editor.innerHTML;
    }
    localStorage.setItem('notes', JSON.stringify(notes));
    renderNotes();
  }

  document.getElementById('btn-save').addEventListener('click', () => {
    saveCurrentNote();
    alert("Note sauvegardée !");
  });

  document.getElementById('btn-new-note').addEventListener('click', () => {
    const title = prompt("Titre de la nouvelle note :");
    if (title) {
      notes.push({ title, content: '' });
      currentNoteId = notes.length - 1;
      editor.innerHTML = '';
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  });

  document.getElementById('btn-delete').addEventListener('click', () => {
    if (currentNoteId !== null && confirm("Supprimer cette note ?")) {
      notes.splice(currentNoteId, 1);
      currentNoteId = null;
      editor.innerHTML = '';
      localStorage.setItem('notes', JSON.stringify(notes));
      renderNotes();
    }
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    navigator.clipboard.writeText(editor.innerText).then(() => {
      alert("Note copiée 📋");
    });
  });

  document.getElementById('btn-darkmode').addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });

  let locked = false;
  document.getElementById('btn-lock').addEventListener('click', () => {
    const pwd = prompt("Mot de passe pour verrouiller/déverrouiller");
    if (!pwd) return;
    locked = !locked;
    editor.contentEditable = !locked;
    alert(locked ? "Note verrouillée 🔒" : "Note déverrouillée 🔓");
  });

  toggleSidebar.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  document.querySelectorAll('[data-cmd]').forEach(button => {
    button.addEventListener('click', () => {
      const cmd = button.getAttribute('data-cmd');
      const value = button.getAttribute('data-value') || null;
      document.execCommand(cmd, false, value);
      editor.focus();
    });
  });

  renderNotes();

  window.addEventListener('online', () => status.textContent = '🟢 En ligne');
  window.addEventListener('offline', () => status.textContent = '🔴 Hors ligne');
  status.textContent = navigator.onLine ? '🟢 En ligne' : '🔴 Hors ligne';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('✅ Service Worker enregistré'))
      .catch(err => console.error('❌ Échec SW:', err));
  }
});

document.getElementById('toggle-sidebar').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
