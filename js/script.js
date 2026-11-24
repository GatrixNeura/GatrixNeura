const $ = (selector) => document.querySelector(selector);

// ---------- 1. Tarjetas de proyectos (cada una lleva a proyecto.html) ----------
$("#lista-proyectos").innerHTML = proyectos.map((p) => `
  <a class="tarjeta" href="proyecto.html?id=${p.id}">
    <div class="portada">
      <span>${p.emoji || "🎮"}</span>
      <img src="${p.portada}" alt="" onerror="this.remove()">
    </div>
    <div class="info">
      <small>${p.genero}</small>
      <h3>${p.titulo}</h3>
      <p>${p.resumen}</p>
      <ul class="etiquetas">${p.tecnologias.map((t) => `<li>${t}</li>`).join("")}</ul>
    </div>
  </a>`).join("");

// ---------- 2. Formulario de contacto ----------
// GitHub Pages no tiene servidor, así que el formulario abre tu correo con el mensaje armado.
$("#formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const cuerpo = `${f.get("mensaje")}\n\n— ${f.get("nombre")} (${f.get("email")})`;
  window.location.href = `mailto:Dylanfer.enterprise@gmail.com?subject=${encodeURIComponent(f.get("asunto"))}&body=${encodeURIComponent(cuerpo)}`;
  $("#aviso").hidden = false;
});
