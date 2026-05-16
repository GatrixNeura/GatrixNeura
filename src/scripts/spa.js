// src/scripts/spa.js
// ── SPA Logic — Portfolio Dylan Fernandez ──

const projects = window.__PROJECTS__;
let currentDetailProject = null;

// ── NAVIGATION ──
function navigate(page, opts = {}) {
  const tr = document.getElementById('transition');
  const colors = { home: 'var(--accent)', about: 'var(--accent3)', contact: 'var(--accent2)', detail: 'var(--accent)' };
  tr.style.background = colors[page] || 'var(--accent)';
  tr.className = 'page-transition in';

  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navMap = { home: 'nav-inicio', about: 'nav-about', contact: 'nav-contact' };
    if (navMap[page]) document.getElementById(navMap[page]).classList.add('active');

    if (page === 'detail' && opts.idx !== undefined) populateDetail(projects[opts.idx]);

    window.scrollTo({ top: 0, behavior: 'instant' });
    history.pushState({ page, idx: opts.idx }, '', '#' + page + (opts.idx !== undefined ? '-' + opts.idx : ''));

    tr.className = 'page-transition out';
    tr.addEventListener('animationend', () => { tr.className = 'page-transition'; }, { once: true });
  }, 350);
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  if (e.state && e.state.page) {
    const { page, idx } = e.state;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    if (page === 'detail' && idx !== undefined) populateDetail(projects[idx]);
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const navMap = { home: 'nav-inicio', about: 'nav-about', contact: 'nav-contact' };
    if (navMap[page]) document.getElementById(navMap[page]).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
});

// ── SHOCKWAVE ──
function spawnShockwave(x, y) {
  const el = document.createElement('div');
  el.className = 'shockwave';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.width = el.style.height = '60px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function openProject(e, idx) {
  const rect = e.currentTarget.getBoundingClientRect();
  spawnShockwave(rect.left + rect.width / 2, rect.top + rect.height / 2);
  navigate('detail', { idx });
}

// ── POPULATE DETAIL ──
function populateDetail(p) {
  currentDetailProject = p;
  document.getElementById('d-genre').textContent = p.genre;
  document.getElementById('d-title').textContent = p.title;
  document.getElementById('d-desc').textContent  = p.desc;
  document.getElementById('d-mechanics').textContent = p.mechanics;
  document.getElementById('repo-name').textContent   = p.title;
  document.getElementById('repo-count').textContent  = p.files.length + ' archivos';

  document.getElementById('d-tech').innerHTML =
    p.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');

  document.getElementById('d-meta').innerHTML =
    p.meta.map(m => `<div class="meta-item"><div class="meta-label">${m.l}</div><div class="meta-val">${m.v}</div></div>`).join('');

  document.getElementById('d-screenshots').innerHTML =
    p.screenshots.map(s => `<div class="ss-placeholder">${s}</div>`).join('');

  document.getElementById('d-files').innerHTML = p.files.map((f, i) => `
    <div class="repo-file-row">
      <div class="repo-file-icon">${f.ext}</div>
      <div class="repo-file-name">${f.name}</div>
      <div class="repo-file-size">${f.size}</div>
      <div class="repo-file-actions">
        <button class="repo-btn view" onclick="viewFile(${i})">👁 VER</button>
        <button class="repo-btn dl"   onclick="downloadFile(${i})">⬇ DL</button>
      </div>
    </div>`).join('');
}

// ── SYNTAX HIGHLIGHT ──
function syntaxHighlight(code, ext) {
  let h = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  h = h.replace(/(\/\/[^\n]*)/g, '<span class="cmt">$1</span>');
  h = h.replace(/(#(?!pragma)[^\n]*)/g, '<span class="cmt">$1</span>');
  h = h.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '<span class="str">$1</span>');
  const kwCS  = /\b(public|private|protected|static|void|class|new|return|if|else|for|foreach|while|var|using|namespace|this|bool|int|float|string|null|true|false|override|virtual|const|get|set|abstract)\b/g;
  const kwGD  = /\b(func|var|const|if|else|elif|for|while|return|extends|class|self|null|true|false|and|or|not|pass|in|is|match|signal|onready|static|await)\b/g;
  const kwCPP = /\b(void|int|float|bool|class|public|private|protected|return|if|else|for|while|new|delete|nullptr|true|false|const|static|virtual|override|auto|struct|include|using|namespace)\b/g;
  const kwMap = { CS: kwCS, GD: kwGD, CPP: kwCPP, H: kwCPP, INK: kwGD, SHADER: kwCS, GLSL: kwCS };
  h = h.replace(kwMap[ext] || kwCS, '<span class="kw">$1</span>');
  h = h.replace(/\b(\d+\.?\d*f?)\b/g, '<span class="num">$1</span>');
  h = h.replace(/\b([A-Z][A-Za-z0-9]{2,})\b/g, '<span class="cls">$1</span>');
  return h;
}

function viewFile(idx) {
  if (!currentDetailProject) return;
  const f = currentDetailProject.files[idx];
  document.getElementById('modal-filename').textContent = f.name;
  document.getElementById('modal-dl-btn').onclick = () => downloadFile(idx);
  const lines = (f.code || '').split('\n');
  document.getElementById('modal-lines').innerHTML = lines.map((_, i) => i + 1).join('<br>');
  document.getElementById('modal-code').innerHTML  = syntaxHighlight(f.code || '', f.ext);
  document.getElementById('codeModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('codeModal').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('codeModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

function downloadFile(idx) {
  if (!currentDetailProject) return;
  const f = currentDetailProject.files[idx];
  const blob = new Blob([f.code || `// ${f.name}`], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = f.name;
  a.click();
  URL.revokeObjectURL(a.href);
}

// ── CONTACT ──
function sendContact() {
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const subject = document.getElementById('c-subject').value.trim();
  const message = document.getElementById('c-message').value.trim();
  if (!name || !email || !message) { alert('Por favor completá nombre, email y mensaje.'); return; }
  const mailto = `mailto:Dylanfer.enterprise@gmail.com?subject=${encodeURIComponent(subject || 'Contacto desde Portfolio')}&body=${encodeURIComponent('Nombre: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;
  window.location.href = mailto;
  document.getElementById('c-success').classList.add('show');
  ['c-name', 'c-email', 'c-subject', 'c-message'].forEach(id => (document.getElementById(id).value = ''));
}

// ── EXPOSE GLOBALS ──
window.navigate     = navigate;
window.openProject  = openProject;
window.viewFile     = viewFile;
window.closeModal   = closeModal;
window.downloadFile = downloadFile;
window.sendContact  = sendContact;

// ── INIT ──
document.getElementById('nav-inicio').classList.add('active');
history.replaceState({ page: 'home' }, '', '#home');
