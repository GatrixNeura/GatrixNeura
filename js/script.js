const barra = document.querySelector(".barra");

window.addEventListener("scroll", function () {

  if (window.scrollY > 50) {
    barra.classList.add("bajando");
  } else {
    barra.classList.remove("bajando");
  }

});

const botonModo = document.querySelector("#boton-modo");

botonModo.addEventListener("click", function () {

  document.body.classList.toggle("claro");

  if (document.body.classList.contains("claro")) {
    botonModo.textContent = "🌙";
    localStorage.setItem("modo", "claro");
  } else {
    botonModo.textContent = "☀️";
    localStorage.setItem("modo", "oscuro");
  }

});

try {
  if (localStorage.getItem("modo") === "claro") {
    document.body.classList.add("claro");
    botonModo.textContent = "🌙";
  }
} catch (error) {
}
