// Sidebar toggle
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.getElementById('backdrop');

function openSidebar() {
  document.body.classList.add('sidebar-open');
  sidebar.setAttribute('aria-hidden', 'false');
  sidebarToggle.setAttribute('aria-expanded', 'true');
}
function closeSidebar() {
  document.body.classList.remove('sidebar-open');
  sidebar.setAttribute('aria-hidden', 'true');
  sidebarToggle.setAttribute('aria-expanded', 'false');
}
sidebarToggle.addEventListener('click', () => {
  document.body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
});
backdrop.addEventListener('click', closeSidebar);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSidebar();
});

// Mise en forme
document.querySelector('.format-toolbar').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cmd]');
  if (!btn) return;
  const cmd = btn.dataset.cmd;
  applyFormatSmart(cmd);
});

function applyFormatSmart(cmd) {
  const link = getLinkInSelection();
  if (link) {
    wrapNodeWithFormat(link, cmd);
  } else {
    document.execCommand(cmd, false, null);
  }
}

function getLinkInSelection() {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return null;
  let node = sel.anchorNode;
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
  return node ? node.closest('a') :
