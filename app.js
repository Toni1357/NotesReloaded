// Initialisation, chargement des données
let notes = JSON.parse(localStorage.getItem('notes')||'[]');
let categories = JSON.parse(localStorage.getItem('cats')||'[]');
renderCategories(); renderNotesList();

const editor = document.getElementById('noteContent');
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let drawing=false;

// Toolbar actions
document.querySelectorAll('[data-cmd]').forEach(btn => {
  btn.onclick = () => document.execCommand(btn.dataset.cmd);
});
document.getElementById('fontSize').onchange = e =>
  document.execCommand('fontSize', false, e.target.value);
document.getElementById('fontColor').onchange = e =>
  document.execCommand('foreColor', false, e.target.value);

// Dessin à la souris
document.getElementById('drawMode').onclick = () => {
  canvas.style.display = canvas.style.display?'':'block';
};
canvas.onmousedown =()=> drawing=true;
canvas.onmouseup =()=> drawing=false;
canvas.onmousemove = e => {
  if (!drawing) return;
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
};

// Gestion notes et catégories
document.getElementById('addCategory').onclick = () => {
  const name = prompt('Nom de la catégorie');
  if (!name) return;
  categories.push(name);
  saveCats(); renderCategories();
};
function renderCategories(){
  const list = document.getElementById('categories');
  list.innerHTML = '';
  categories.forEach((c,i) => {
    let btn=document.createElement('button');
    btn.textContent=c; btn.onclick=()=>filterByCat(i);
    list.appendChild(btn);
  });
}
function filterByCat(idx){
  renderNotesList(n=>n.cat===idx);
}

// Création et sélection de notes
document.getElementById('addNote').onclick = () => {
  const n={id:Date.now(),cat:0,html:'',draw:''};
  notes.push(n); saveNotes(); renderNotesList();
};
function renderNotesList(filterFn){
  const list=document.getElementById('notesList');
  list.innerHTML='';
  notes.filter(n=>!filterFn||filterFn(n)).forEach(n=>{
    let btn=document.createElement('button');
    btn.textContent = `Note ${n.id}`;
    btn.onclick = ()=>loadNote(n.id);
    list.appendChild(btn);
  });
}
function loadNote(id){
  const n=notes.find(x=>x.id===id);
  editor.innerHTML=n.html;
  if(n.draw){
    let img=new Image();
    img.onload=()=>ctx.drawImage(img,0,0);
    img.src=n.draw;
  }
  currentId=id;
}

// Sauvegarde
let currentId=null;
document.getElementById('saveNote').onclick = () => {
  const note = notes.find(n=>n.id===currentId);
  note.html = editor.innerHTML;
  note.draw = canvas.toDataURL();
  saveNotes();
  alert('Enregistré localement');
};
function saveNotes(){
  localStorage.setItem('notes', JSON.stringify(notes));
}
function saveCats(){
  localStorage.setItem('cats', JSON.stringify(categories));
}
