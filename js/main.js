/* ---------- starfield background ---------- */
// The canvas only covers the viewport. Star positions are stored normalized
// (0–1) so a mobile URL bar showing/hiding doesn't reshuffle the sky, and a
// slow scroll parallax keeps the feeling of drifting through space without
// painting a document-tall canvas every frame.
(function () {
  var canvas = document.getElementById('stars');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CANDY = ['255, 111, 156', '255, 154, 77', '165, 224, 90', '178, 133, 232'];
  var FRAME_MS = 1000 / 30;
  var stars = [];
  var width = 0;
  var height = 0;
  var lastFrame = 0;
  var rafId = null;

  function seed() {
    var count = Math.min(320, Math.round((canvas.clientWidth * canvas.clientHeight) / 9000));
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.2 + 0.3,
        depth: 0.25 + Math.random() * 0.75,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0006 + Math.random() * 0.0012,
        color: Math.random() < 0.04 ? CANDY[i % CANDY.length] : '214, 231, 241'
      });
    }
  }

  function size() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    // clientWidth excludes the scrollbar, so stars aren't stretched sideways
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    var scroll = reduced ? 0 : window.scrollY;
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var y = (s.y * height - scroll * s.depth * 0.06) % height;
      if (y < 0) y += height;
      var alpha = reduced ? 0.55 : 0.35 + 0.45 * Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.beginPath();
      ctx.arc(s.x * width, y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + s.color + ', ' + alpha + ')';
      ctx.fill();
    }
  }

  function loop(t) {
    rafId = requestAnimationFrame(loop);
    if (t - lastFrame < FRAME_MS) return;
    lastFrame = t;
    draw(t);
  }

  function start() {
    if (reduced) { draw(0); return; }
    if (rafId === null) rafId = requestAnimationFrame(loop);
  }

  function stop() {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  var lastWidth = canvas.clientWidth;
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Re-seed only when the width really changes (rotation, window resize),
      // not when a phone's URL bar collapses and nudges the height.
      if (canvas.clientWidth !== lastWidth) { lastWidth = canvas.clientWidth; seed(); }
      size();
      if (reduced) draw(0);
    }, 150);
  });

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  seed();
  size();
  start();
})();

/* ---------- i18n ---------- */
var I18N = {
  es: {
    'meta.title': 'Moonchies — Boricuas hasta en la luna',
    'a11y.skip': 'Saltar al contenido',
    'nav.label': 'Secciones',
    'nav.menu': 'Menú',
    'nav.top': 'Volver arriba',
    'nav.story': 'Historia',
    'nav.mission': 'Misión',
    'nav.episodes': 'Episodios',
    'nav.ideas': 'Ideas',
    'nav.contact': 'Contacto',
    'nav.cta': 'Lista de espera',
    'hero.badge': 'Hecho en Puerto Rico',
    'hero.tagline': 'Boricuas hasta en la luna.',
    'hero.lede': 'Comida de otra órbita.',
    'hero.logo_alt': 'Astronauta Moonchies flotando en el espacio con bandera de Puerto Rico, rodeado de dulces — ilustración de @dontouchmyink',
    'story.eyebrow': 'La historia del nombre',
    'story.p1': 'Freeze-a-Rican.',
    'story.p2': 'Así nos íbamos a llamar. Lo sabemos.',
    'story.p3a': 'Moonchies nos lo trajo',
    'story.p3b': '. Nos salvó de una.',
    'story.p4': 'Munchies, pero en la luna — que es donde se come esto. La comida liofilizada lleva décadas subiendo al espacio. Nosotros la bajamos a Puerto Rico.',
    'mission.eyebrow': '¿Y si le sacamos el agua?',
    'mission.title': 'Reinventar lo que la comida puede ser.',
    'mission.body': 'En Moonchies usamos liofilización para convertir productos cotidianos en experiencias que sorprenden: texturas que no deberían existir, sabor concentrado, y la curiosidad de descubrir qué pasa cuando le sacas el agua a algo. Documentamos cada experimento — el que sale bien y el que no. Creamos desde Puerto Rico, para cualquier punto del universo.',
    'vision.label': 'Nuestra visión',
    'vision.body': 'Ser la marca que convierte la liofilización en una forma de jugar con la comida — reconocida porque cada experimento es algo que la gente quiere ver, probar y compartir. Que Moonchies signifique curiosidad. Y que se sepa de dónde salió.',
    'wifd.eyebrow': 'La serie',
    'wifd.lede': '5 episodios y contando — cada experimento, documentado, salga bien o mal.',
    'wifd.soon': 'Próximamente',
    'wifd.play_label': 'Ver video en TikTok',
    'wifd.like_label': 'Dale like en TikTok',
    'wifd.ep1_tag': 'Episodio 1',
    'wifd.ep1_title': 'Skittles — la primera prueba',
    'wifd.ep1_body': '¿Qué pasa cuando le quitas el agua a un Skittle? Este fue nuestro primer experimento.',
    'wifd.ep1_alt': 'Miniatura del video de TikTok: Skittles liofilizados, primera prueba',
    'wifd.ep2_tag': 'Episodio 2',
    'wifd.ep2_title': 'Skittles — segunda ronda',
    'wifd.ep2_body': 'Seguimos afinando el proceso — así quedó la textura esta vez.',
    'wifd.ep2_alt': 'Miniatura del video de TikTok: Skittles liofilizados, segunda ronda',
    'wifd.ep3_tag': 'Episodio 3',
    'wifd.ep3_title': 'Gummy Sharks — el resultado inesperado',
    'wifd.ep3_body': '¿Qué pasa cuando le quitas el agua a un gummy shark? Esto no nos lo esperábamos.',
    'wifd.ep3_alt': 'Miniatura del video de TikTok: gummy sharks liofilizados',
    'wifd.ep4_tag': 'Episodio 4',
    'wifd.ep4_title': 'Mantecado de vainilla, con sprinkles',
    'wifd.ep4_body': 'Esto es lo que se come en el espacio — mantecado liofilizado, sin una gota de agua.',
    'wifd.ep4_alt': 'Miniatura del video de TikTok: mantecado de vainilla liofilizado con sprinkles',
    'wifd.ep5_tag': 'Episodio 5',
    'wifd.ep5_title': 'Pizza — horneada vs. congelada',
    'wifd.ep5_body': 'Una pizza horneada, una congelada, ambas 20 horas en la máquina. No esperábamos este resultado.',
    'wifd.ep5_alt': 'Miniatura del video de TikTok: pizza liofilizada, horneada y congelada',
    'contact.eyebrow': 'Contacto',
    'contact.title': '¿Preguntas? Escríbenos.',
    'contact.lede': 'Por ahora no hay tienda, pero si tienes preguntas o quieres saber más, aquí nos encuentras.',
    'contact.email_label': 'Correo',
    'suggest.eyebrow': 'Tu idea',
    'suggest.title': '¿Qué liofilizamos la próxima?',
    'suggest.lede': 'Cuéntanos qué probar en un próximo experimento.',
    'suggest.field_label': 'Tu idea',
    'suggest.placeholder': 'Ej. ¿Gomitas de tamarindo?',
    'suggest.submit': 'Enviar idea',
    'suggest.confirm': '¡Gracias! La anotamos.',
    'waitlist.eyebrow': 'Lista de espera',
    'waitlist.title': 'Sé de los primeros en probarlo',
    'waitlist.lede': 'Te avisamos apenas tengamos empaque listo y fecha de lanzamiento — sin spam, solo lo importante.',
    'waitlist.field_label': 'Correo electrónico',
    'waitlist.placeholder': 'tu@correo.com',
    'waitlist.subscription': 'Me interesa una caja de suscripción',
    'waitlist.submit': 'Unirme',
    'waitlist.confirm': '¡Listo! Te avisamos apenas lancemos.',
    'waitlist.follow': 'Mientras tanto, síguenos para ver los experimentos:',
    'waitlist.disclaimer': 'Por ahora no vendemos nada — esto es lista de espera y contenido. La tienda llega en la próxima fase.',
    'footer.tagline': 'Hecho en Puerto Rico. Probado en el vacío.',
    'footer.credit': 'Ilustración de marca por',
    'form.error': 'Algo salió mal. Intenta de nuevo o escríbenos por Instagram.',
    'notfound.meta_title': 'Página no encontrada — Moonchies',
    'notfound.title': 'Aquí no quedó nada.',
    'notfound.body': 'Esta página no existe — o la liofilizamos de más. Vuelve al inicio o mira los experimentos.',
    'notfound.home': 'Volver al inicio',
    'notfound.episodes': 'Ver los experimentos'
  },
  en: {
    'meta.title': 'Moonchies — Boricua, even on the moon',
    'a11y.skip': 'Skip to content',
    'nav.label': 'Sections',
    'nav.menu': 'Menu',
    'nav.top': 'Back to top',
    'nav.story': 'Story',
    'nav.mission': 'Mission',
    'nav.episodes': 'Episodes',
    'nav.ideas': 'Ideas',
    'nav.contact': 'Contact',
    'nav.cta': 'Waitlist',
    'hero.badge': 'Made in Puerto Rico',
    'hero.tagline': 'Boricua, even on the moon.',
    'hero.lede': 'Snacks from another orbit.',
    'hero.logo_alt': 'Moonchies astronaut floating in space holding a Puerto Rican flag, surrounded by candy — illustration by @dontouchmyink',
    'story.eyebrow': 'The story behind the name',
    'story.p1': 'Freeze-a-Rican.',
    'story.p2': "That's what we were going to call ourselves. We know.",
    'story.p3a': 'Moonchies came from',
    'story.p3b': '. She saved us.',
    'story.p4': "Munchies, but on the moon — which is where this stuff actually gets eaten. Freeze-dried food has been going to space for decades. We brought it back down to Puerto Rico.",
    'mission.eyebrow': 'What if we take the water out?',
    'mission.title': 'Reinventing what food can be.',
    'mission.body': "At Moonchies we use freeze-drying to turn everyday products into experiences that surprise: textures that shouldn't exist, concentrated flavor, and the curiosity of finding out what happens when you take the water out of something. We document every experiment — the ones that work and the ones that don't. Made in Puerto Rico, for anywhere in the universe.",
    'vision.label': 'Our vision',
    'vision.body': 'To be the brand that turns freeze-drying into a way of playing with food — known because every experiment is something people want to watch, taste, and share. To make Moonchies mean curiosity. And to make sure everyone knows where it came from.',
    'wifd.eyebrow': 'The series',
    'wifd.lede': '5 episodes and counting — every experiment, documented, win or fail.',
    'wifd.soon': 'Coming soon',
    'wifd.play_label': 'Watch video on TikTok',
    'wifd.like_label': 'Like on TikTok',
    'wifd.ep1_tag': 'Episode 1',
    'wifd.ep1_title': 'Skittles — the first try',
    'wifd.ep1_body': 'What happens when you take the water out of a Skittle? This was our first experiment.',
    'wifd.ep1_alt': 'TikTok video thumbnail: freeze-dried Skittles, first try',
    'wifd.ep2_tag': 'Episode 2',
    'wifd.ep2_title': 'Skittles — round two',
    'wifd.ep2_body': "Still dialing in the process — here's how the texture turned out this time.",
    'wifd.ep2_alt': 'TikTok video thumbnail: freeze-dried Skittles, round two',
    'wifd.ep3_tag': 'Episode 3',
    'wifd.ep3_title': 'Gummy Sharks — the unexpected result',
    'wifd.ep3_body': "What happens when you take the water out of a gummy shark? We didn't see this coming.",
    'wifd.ep3_alt': 'TikTok video thumbnail: freeze-dried gummy sharks',
    'wifd.ep4_tag': 'Episode 4',
    'wifd.ep4_title': 'Vanilla ice cream, with sprinkles',
    'wifd.ep4_body': "This is what they eat in space — freeze-dried ice cream, without a drop of water.",
    'wifd.ep4_alt': 'TikTok video thumbnail: freeze-dried vanilla ice cream with sprinkles',
    'wifd.ep5_tag': 'Episode 5',
    'wifd.ep5_title': 'Pizza — baked vs. frozen',
    'wifd.ep5_body': "One baked pizza, one frozen, both 20 hours in the machine. We didn't expect this result.",
    'wifd.ep5_alt': 'TikTok video thumbnail: freeze-dried pizza, baked and frozen versions',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Questions? Reach out.',
    'contact.lede': "There's no store yet, but if you have questions or want to know more, here's where to find us.",
    'contact.email_label': 'Email',
    'suggest.eyebrow': 'Your idea',
    'suggest.title': 'What should we freeze-dry next?',
    'suggest.lede': 'Tell us what to try in a future experiment.',
    'suggest.field_label': 'Your idea',
    'suggest.placeholder': 'E.g. Tamarind gummies?',
    'suggest.submit': 'Send idea',
    'suggest.confirm': 'Thanks! We noted it.',
    'waitlist.eyebrow': 'Waitlist',
    'waitlist.title': 'Be among the first to try it',
    'waitlist.lede': "We'll let you know as soon as packaging is ready and we have a launch date — no spam, just what matters.",
    'waitlist.field_label': 'Email address',
    'waitlist.placeholder': 'you@email.com',
    'waitlist.subscription': "I'm interested in a subscription box",
    'waitlist.submit': 'Join',
    'waitlist.confirm': "Done! We'll let you know when we launch.",
    'waitlist.follow': "In the meantime, follow along to see the experiments:",
    'waitlist.disclaimer': "We're not selling anything yet — this is just the waitlist and content. The store is coming in the next phase.",
    'footer.tagline': 'Made in Puerto Rico. Tested in a vacuum.',
    'footer.credit': 'Brand illustration by',
    'form.error': 'Something went wrong. Please try again or message us on Instagram.',
    'notfound.meta_title': 'Page not found — Moonchies',
    'notfound.title': 'Nothing left here.',
    'notfound.body': "This page doesn't exist — or we freeze-dried it a little too long. Head back home or check out the experiments.",
    'notfound.home': 'Back to home',
    'notfound.episodes': 'See the experiments'
  }
};

function readStorage(key) {
  try { return window.localStorage.getItem(key); } catch (e) { return null; }
}
function writeStorage(key, value) {
  try { window.localStorage.setItem(key, value); } catch (e) { /* storage blocked: preference just won't persist */ }
}

(function () {
  var STORAGE_KEY = 'moonchies_lang';
  var toggle = document.getElementById('langToggle');

  function applyLang(lang) {
    var dict = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    ['alt', 'placeholder', 'aria-label'].forEach(function (attr) {
      document.querySelectorAll('[data-i18n-' + attr + ']').forEach(function (el) {
        var key = el.getAttribute('data-i18n-' + attr);
        if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
      });
    });
    document.documentElement.lang = lang;
    if (toggle) {
      toggle.textContent = lang === 'es' ? 'EN' : 'ES';
      toggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
    }
    writeStorage(STORAGE_KEY, lang);
  }

  var saved = readStorage(STORAGE_KEY);
  applyLang(saved === 'en' || saved === 'es' ? saved : 'es');

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyLang(document.documentElement.lang === 'en' ? 'es' : 'en');
    });
  }
})();

/* ---------- navigation: menu, active section, scroll progress, back to top ---------- */
(function () {
  var header = document.querySelector('header.nav');
  if (!header) return;
  var menu = document.getElementById('navMenu');
  var menuBtn = document.getElementById('navMenuBtn');
  var progressBar = header.querySelector('.scroll-progress span');
  var toTop = document.getElementById('backToTop');

  function isOpen() { return header.classList.contains('menu-open'); }
  function setMenu(open) {
    if (!menuBtn) return;
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
  }

  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () { setMenu(!isOpen()); });
    // Any link in the header (section, social, waitlist CTA) closes the menu.
    header.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { setMenu(false); menuBtn.focus(); }
    });
    header.addEventListener('focusout', function (e) {
      if (isOpen() && e.relatedTarget && !header.contains(e.relatedTarget)) setMenu(false);
    });
    window.matchMedia('(min-width: 60rem)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  // Mark the section currently in the middle of the viewport.
  if (menu && 'IntersectionObserver' in window) {
    var links = {};
    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      links[link.getAttribute('href').slice(1)] = link;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        Object.keys(links).forEach(function (id) { links[id].removeAttribute('aria-current'); });
        var link = links[entry.target.id];
        if (link) link.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (section) {
      observer.observe(section);
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressBar) progressBar.style.transform = 'scaleX(' + progress + ')';
      if (toTop) toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.2);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      var main = document.getElementById('contenido');
      if (main) main.focus({ preventScroll: true });
    });
  }
})();

/* ---------- Netlify forms (AJAX submit) ---------- */
function wireNetlifyForm(formId, confirmId) {
  var form = document.getElementById(formId);
  var confirmEl = document.getElementById(confirmId);
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new URLSearchParams(new FormData(form)).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        confirmEl.classList.remove('error');
        confirmEl.classList.add('show');
        form.reset();
      })
      .catch(function () {
        confirmEl.classList.add('show', 'error');
      });
  });
}

/* ---------- Will It Freeze Dry: open the exact video on TikTok ---------- */
// Embedding TikTok's video widget inline proved unreliable across browsers
// (broken layout, slow/blank loading, "related videos" at the end, and a
// fallback CTA that didn't point at the right video). Opening the exact
// video URL on TikTok itself is simple, fast, and always correct — and it
// still counts as a real view/like on the actual platform.
(function () {
  document.querySelectorAll('.wifd-tile[data-tiktok-url]').forEach(function (tile) {
    var playBtn = tile.querySelector('.wifd-play');
    if (!playBtn) return;
    playBtn.addEventListener('click', function () {
      window.open(tile.getAttribute('data-tiktok-url'), '_blank', 'noopener');
    });
  });
})();

wireNetlifyForm('waitlistForm', 'waitlistConfirm');
wireNetlifyForm('suggestForm', 'suggestConfirm');
