const $ = (selector) => document.querySelector(selector);

// El proyecto se elige por la dirección: proyecto.html?id=AstroKitt
const id = new URLSearchParams(window.location.search).get("id");
const p = proyectos.find((x) => x.id === id);
const contenedor = $("#proyecto");

const dato = (etiqueta, valor) =>
  valor ? `<div class="dato"><small>${etiqueta}</small><strong>${valor}</strong></div>` : "";

if (!p) {
  contenedor.innerHTML = `<a class="volver" href="index.html#proyectos">← Volver a proyectos</a>
    <h1>Proyecto no encontrado</h1>`;
} else {
  document.title = `${p.titulo} — Dylan Fernandez`;
  const mecanicas = Array.isArray(p.mecanicas)
    ? `<ul>${p.mecanicas.map((m) => `<li>${m}</li>`).join("")}</ul>`
    : `<p>${p.mecanicas}</p>`;

  contenedor.innerHTML = `
    <a class="volver" href="index.html#proyectos">← Volver a proyectos</a>
    <br><small>${p.genero}</small>
    <h1>${p.titulo}</h1>

    <div class="proyecto-grid">
      <div class="medios">
        ${p.video
          ? `<iframe class="video" src="${p.video}" allowfullscreen></iframe>`
          : `<div class="trailer"><span>▷</span><small>Gameplay trailer</small></div>`}
        <div class="fotos">
          ${(p.fotos || []).map((f) => `
            <div class="foto-tile"><span>${p.emoji || "🎮"}</span><img src="${f}" alt="" onerror="this.remove()"></div>`).join("")}
        </div>
      </div>

      <div class="textos">
        <div class="bloque"><h3>Descripción</h3><p>${p.descripcion}</p></div>
        <div class="bloque"><h3>Mecánicas</h3>${mecanicas}</div>
        <div class="bloque"><h3>Tecnologías</h3>
          <ul class="etiquetas">${p.tecnologias.map((t) => `<li>${t}</li>`).join("")}</ul></div>
        <div class="datos-proyecto">
          ${dato("Duración", p.duracion)}${dato("Plataforma", p.plataforma)}
          ${dato("Estado", p.estado)}${dato("Rol", p.rol)}
        </div>
      </div>
    </div>

    <h2 class="titulo-archivos">Archivos del proyecto</h2>
    <div class="panel-archivos">
      <div class="panel-cab"><span>${p.titulo}</span><span>${p.archivos.length} archivos</span></div>
      <div id="archivos"></div>
    </div>
    ${p.itch ? `<a class="boton itch" href="${p.itch}" target="_blank" rel="noopener">Ver en Itch.io</a>` : ""}`;

  p.archivos.forEach((ruta) => $("#archivos").appendChild(crearArchivo(ruta)));
}

// ---------- Archivos: un solo botón (rotulado "Ver") que descarga el archivo ----------

// Arma la dirección del archivo codificando cada parte (por la Ñ, tildes o espacios)
function urlDe(ruta) {
  return ruta.split("/").map(encodeURIComponent).join("/");
}

// Pide el archivo. Si no lo encuentra, prueba la otra forma de escribir tildes/Ñ (NFC/NFD).
// Además revisa r.ok: un archivo que no existe NO tiene que mostrarse como si fuera su contenido.
async function pedirArchivo(ruta, opciones) {
  const variantes = [...new Set([ruta, ruta.normalize("NFC"), ruta.normalize("NFD")])];
  let ultimoError;
  for (const v of variantes) {
    try {
      const r = await fetch(urlDe(v), opciones);
      if (r.ok) return r;
      ultimoError = new Error("HTTP " + r.status);
    } catch (e) {
      ultimoError = e;
    }
  }
  throw ultimoError;
}

// Descarga de verdad: baja el archivo, lo convierte en "binario genérico" y fuerza el guardado.
// Así el navegador no intenta abrirlo en una pestaña aunque sea un .gd, .txt, .js, etc.
async function descargar(ruta, nombre) {
  const disparar = (href) => {
    const enlace = document.createElement("a");
    enlace.href = href;
    enlace.download = nombre;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
  };
  try {
    const r = await pedirArchivo(ruta);
    const blob = new Blob([await r.blob()], { type: "application/octet-stream" });
    const temporal = URL.createObjectURL(blob);
    disparar(temporal);
    setTimeout(() => URL.revokeObjectURL(temporal), 2000);
  } catch {
    disparar(urlDe(ruta)); // plan B: enlace normal con download
  }
}

function crearArchivo(ruta) {
  const nombre = ruta.split("/").pop();
  const ext = nombre.split(".").pop().toLowerCase();
  const caja = document.createElement("div");
  caja.className = "archivo";
  caja.innerHTML = `
    <div class="fila">
      <span class="ext">${ext}</span>
      <span class="nombre">${nombre}</span>
      <span class="peso"></span>
      <a class="dl" href="${urlDe(ruta)}" download="${nombre}">Ver</a>
    </div>`;

  // Tamaño del archivo (si el servidor lo informa)
  pedirArchivo(ruta, { method: "HEAD" }).then((r) => {
    const bytes = r.headers.get("content-length");
    if (bytes) caja.querySelector(".peso").textContent = (bytes / 1024).toFixed(1) + " KB";
  }).catch(() => {});

  caja.querySelector(".dl").addEventListener("click", (e) => {
    e.preventDefault();
    descargar(ruta, nombre);
  });
  return caja;
}
