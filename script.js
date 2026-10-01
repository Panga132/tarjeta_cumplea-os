/* ============================================================
   PERSONALIZA AQUÍ
   ============================================================ */
const CONFIG = {
  NOMBRE_PERSONA: "Julian",            // Ej: "Laura". Vacío = solo "¡FELIZ CUMPLEAÑOS!"
  FECHA: "",                     // Ej: "30 de septiembre" (aparece junto al nombre)
  FOTOGRAFIAS: ["imagen1.jpeg","imagen2.jpeg","imagen3.jpeg","imagen4.jpeg","imagen5.jpeg","imagen6.jpeg","imagen7.jpeg","imagen8.jpeg","imagen9.jpeg","imagen10.jpeg"],  // Fotos de la sección RECUERDOS (en la carpeta /img)
  FRASES: [                      // Frases de la sección RECUERDOS
    "Por las risas y la unión que siempre nos acompañan.",
    "Por cada momento en familia que quedará para siempre.",
    "Por esos instantes de celebración que nos llenan el corazón.",
    "Por todo lo vivido y por lo mucho que todavía falta por compartir.",
    "Y por todas las historias que siguen escribiéndose juntos."
  ]
};

/* ---------- Utilidades ---------- */
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];   // querySelectorAll -> array
const rnd = (a, b) => a + Math.random() * (b - a);
const COLORS = ["#FFD54F", "#FF9800", "#EF5350", "#F8BBD0", "#FFFFFF", "#78909C"];

/* ---------- Ilustraciones SVG (se inyectan en los contenedores) ---------- */
const balloonSVG = c => `<svg viewBox="0 0 60 110" aria-hidden="true">
  <path d="M30 2C12 2 4 18 4 34c0 18 14 34 26 36 12-2 26-18 26-36C56 18 48 2 30 2z" fill="${c}"/>
  <path d="M30 70l-5 8h10z" fill="${c}"/>
  <path d="M30 78c-6 10 6 16 0 30" stroke="#ECEFF1" fill="none" stroke-width="1.5"/>
  <ellipse cx="19" cy="22" rx="5" ry="9" fill="#fff" opacity=".35" transform="rotate(20 19 22)"/></svg>`;

const fireworkSVG = c => {                       // 12 rayos que salen del centro
  let l = "";
  for (let i = 0; i < 12; i++) {
    const a = i * Math.PI / 6, x = n => 50 + Math.cos(a) * n, y = n => 50 + Math.sin(a) * n;
    l += `<line x1="${x(14)}" y1="${y(14)}" x2="${x(40)}" y2="${y(40)}" stroke="${c}"/>
          <circle cx="${x(46)}" cy="${y(46)}" r="2.5" fill="${c}"/>`;
  }
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${l}</svg>`;
};

const cakeSVG = `<svg viewBox="0 0 220 200" aria-hidden="true">
  <ellipse cx="110" cy="188" rx="100" ry="10" fill="#ECEFF1"/>
  <rect x="20" y="120" width="180" height="64" rx="12" fill="#F8BBD0"/>
  <rect x="20" y="152" width="180" height="10" fill="#EF5350"/>
  <rect x="50" y="70" width="120" height="52" rx="10" fill="#FFD54F"/>
  <rect x="50" y="98" width="120" height="8" fill="#FF9800"/>
  <path d="M20 128q15-14 30 0t30 0t30 0t30 0t30 0t30 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M50 78q15-14 30 0t30 0t30 0t30 0" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round"/>
  <g fill="#fff"><circle cx="45" cy="172" r="3"/><circle cx="90" cy="170" r="3"/><circle cx="135" cy="172" r="3"/><circle cx="178" cy="170" r="3"/></g>
  <rect x="78" y="44" width="8" height="26" fill="#EF5350"/><rect x="106" y="44" width="8" height="26" fill="#78909C"/><rect x="134" y="44" width="8" height="26" fill="#FF9800"/>
  <g class="flame" fill="#FFD54F"><ellipse cx="82" cy="36" rx="5" ry="9"/><ellipse cx="110" cy="36" rx="5" ry="9"/><ellipse cx="138" cy="36" rx="5" ry="9"/></g>
</svg>`;

/* Inyecta las ilustraciones según los atributos data-* del HTML */
$$("[data-balloon]").forEach(e => e.innerHTML = balloonSVG(e.dataset.balloon));
$$("[data-fw]").forEach(e => e.innerHTML = fireworkSVG(e.dataset.fw));
$$("[data-cake]").forEach(e => e.innerHTML = cakeSVG);

/* ---------- Confeti y estrellas (creados con JS, animados con CSS) ---------- */
$$(".confetti").forEach(box => {
  for (let i = 0; i < +box.dataset.n; i++) {
    const p = document.createElement("i");
    p.style.cssText = `left:${rnd(0, 100)}%;background:${COLORS[i % COLORS.length]};
      animation-duration:${rnd(9, 18)}s;animation-delay:${-rnd(0, 18)}s;transform:scale(${rnd(.6, 1.2)})`;
    box.appendChild(p);
  }
});
$$(".stars").forEach(box => {
  for (let i = 0; i < +box.dataset.n; i++) {
    const s = document.createElement("b");
    s.textContent = "★";
    s.style.cssText = `left:${rnd(0, 97)}%;top:${rnd(0, 95)}%;font-size:${rnd(.7, 1.6)}rem;
      animation-duration:${rnd(3, 6)}s;animation-delay:${-rnd(0, 6)}s`;
    box.appendChild(s);
  }
});

/* ---------- Nombre y fecha ---------- */
const persona = [CONFIG.NOMBRE_PERSONA, CONFIG.FECHA].filter(Boolean).join(" · ");
$("#persona").textContent = persona;

/* ---------- Fotos: solo se muestran las que existen ---------- */
// Crea un Image() en memoria; onload = existe, onerror = no existe (se ignora sin romper nada)
const existe = src => new Promise(ok => {
  const im = new Image();
  im.onload = () => ok(true);
  im.onerror = () => ok(false);
  im.src = src;
});

const tarjeta = (src, i) => {
  const f = document.createElement("figure");
  f.className = "photo reveal";
  f.style.setProperty("--r", `${[-4, 3, -2, 5, -5, 2][i % 6]}deg`);
  f.innerHTML = `<img src="./${src}" alt="Recuerdo ${i + 1}" loading="lazy">`;
  return f;
};

Promise.all(CONFIG.FOTOGRAFIAS.map(existe)).then(res => {
  const ok = CONFIG.FOTOGRAFIAS.filter((_, i) => res[i]);
  const fotosSeccion = ok.slice(0, 5);
  const recuerdosSeccion = ok.slice(5, 10);

  fotosSeccion.forEach((src, i) => $("#wall").appendChild(tarjeta(src, i)));

  // RECUERDOS: muestra las fotos restantes con sus frases
  const mix = $("#mix");
  CONFIG.FRASES.forEach((txt, i) => {
    const p = document.createElement("p");
    p.className = "phrase reveal";
    p.style.setProperty("--r", `${i % 2 ? 2 : -2}deg`);
    p.textContent = txt;
    mix.appendChild(p);

    const fotoRecuerdo = recuerdosSeccion[i];
    if (fotoRecuerdo) mix.appendChild(tarjeta(fotoRecuerdo, i + 5));
  });

  if (!fotosSeccion.length) $("#fotos").hidden = true;     // sin fotos: oculta la sección
  observarReveal();
});

/* ---------- Animación de entrada al hacer scroll ---------- */
function observarReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .15 });
  $$(".reveal:not(.in)").forEach(el => io.observe(el));
}
observarReveal();

/* ---------- Menú móvil ---------- */
const burger = $(".burger"), menu = $("#menu");
const setMenu = open => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#menu a").forEach(a => a.addEventListener("click", () => setMenu(false)));

/* ---------- Enlace activo según la sección visible ---------- */
const links = $$("#menu a");
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
$$("section[id]").forEach(s => spy.observe(s));
