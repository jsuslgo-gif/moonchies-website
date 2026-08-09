/* ---------- starfield background ---------- */
(function () {
  var canvas = document.getElementById('stars');
  var ctx = canvas.getContext('2d');
  var stars = [];
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight;
    var count = Math.floor((canvas.width * canvas.height) / 9000);
    stars = [];
    for (var i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var alpha = reduced ? 0.55 : 0.35 + 0.45 * Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(214, 231, 241, ' + alpha + ')';
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('load', resize);
  requestAnimationFrame(draw);
  if (reduced) draw(0);
})();

/* ---------- i18n ---------- */
var I18N = {
  es: {
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
    'wifd.lede': 'Cada experimento, documentado — salga bien o mal.',
    'wifd.soon': 'Próximamente',
    'wifd.play_label': 'Reproducir video de TikTok',
    'wifd.ep1_tag': 'Episodio 1',
    'wifd.ep1_title': 'Skittles — la primera prueba',
    'wifd.ep1_body': '¿Qué pasa cuando le quitas el agua a un Skittle? Este fue nuestro primer experimento.',
    'wifd.ep1_alt': 'Miniatura del video de TikTok: Skittles liofilizados, primera prueba',
    'wifd.ep2_tag': 'Episodio 2',
    'wifd.ep2_title': 'Skittles — segunda ronda',
    'wifd.ep2_body': 'Seguimos afinando el proceso — así quedó la textura esta vez.',
    'wifd.ep2_alt': 'Miniatura del video de TikTok: Skittles liofilizados, segunda ronda',
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
    'form.error': 'Algo salió mal. Intenta de nuevo o escríbenos por Instagram.'
  },
  en: {
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
    'wifd.lede': 'Every experiment, documented — win or fail.',
    'wifd.soon': 'Coming soon',
    'wifd.play_label': 'Play TikTok video',
    'wifd.ep1_tag': 'Episode 1',
    'wifd.ep1_title': 'Skittles — the first try',
    'wifd.ep1_body': 'What happens when you take the water out of a Skittle? This was our first experiment.',
    'wifd.ep1_alt': 'TikTok video thumbnail: freeze-dried Skittles, first try',
    'wifd.ep2_tag': 'Episode 2',
    'wifd.ep2_title': 'Skittles — round two',
    'wifd.ep2_body': "Still dialing in the process — here's how the texture turned out this time.",
    'wifd.ep2_alt': 'TikTok video thumbnail: freeze-dried Skittles, round two',
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
    'form.error': 'Something went wrong. Please try again or message us on Instagram.'
  }
};

var TITLES = {
  es: 'Moonchies — Boricuas hasta en la luna',
  en: 'Moonchies — Boricua, even on the moon'
};

(function () {
  var STORAGE_KEY = 'moonchies_lang';
  var toggle = document.getElementById('langToggle');

  function applyLang(lang) {
    var dict = I18N[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (dict[key] !== undefined) el.setAttribute('alt', dict[key]);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    var nextLang = lang === 'es' ? 'en' : 'es';
    toggle.textContent = nextLang.toUpperCase();
    toggle.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
    localStorage.setItem(STORAGE_KEY, lang);
  }

  var saved = localStorage.getItem(STORAGE_KEY);
  var initialLang = (saved === 'en' || saved === 'es') ? saved : 'es';
  applyLang(initialLang);

  toggle.addEventListener('click', function () {
    var current = document.documentElement.lang === 'en' ? 'en' : 'es';
    applyLang(current === 'es' ? 'en' : 'es');
  });
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

/* ---------- Will It Freeze Dry: lazy-loaded TikTok embeds ---------- */
(function () {
  var tiktokScriptLoaded = false;

  function loadTikTokScript() {
    if (tiktokScriptLoaded) return;
    tiktokScriptLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.tiktok.com/embed.js';
    s.async = true;
    document.body.appendChild(s);
  }

  document.querySelectorAll('.wifd-tile[data-tiktok-url]').forEach(function (tile) {
    var playBtn = tile.querySelector('.wifd-play');
    if (!playBtn) return;
    playBtn.addEventListener('click', function () {
      var url = tile.getAttribute('data-tiktok-url');
      var embed = document.createElement('div');
      embed.className = 'wifd-embed';
      embed.innerHTML = '<blockquote class="tiktok-embed" cite="' + url + '" data-embed-from="oembed" style="max-width:605px;min-width:325px;"><section></section></blockquote>';
      tile.appendChild(embed);
      tile.classList.add('playing');
      loadTikTokScript();
    });
  });
})();

wireNetlifyForm('waitlistForm', 'waitlistConfirm');
wireNetlifyForm('suggestForm', 'suggestConfirm');
