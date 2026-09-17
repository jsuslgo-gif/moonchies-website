document.documentElement.classList.add('js');

// Umami (cookieless, aggregate). No-ops until its script has loaded or if blocked.
window.MoonchiesTrack = function (name, data) {
  try {
    if (window.umami && typeof window.umami.track === 'function') window.umami.track(name, data);
  } catch (e) { /* analytics must never break the page */ }
};

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
    'hero.cta': 'Únete a la lista de espera',
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
    'wifd.lede': '10 episodios y contando — cada experimento, documentado, salga bien o mal.',
    'wifd.play_label': 'Ver en TikTok:',
    'wifd.like_label': 'Dale like en TikTok',
    'wifd.latest': 'Más reciente',
    'wifd.watch': 'Ver en TikTok',
    'wifd.previous': 'Episodios anteriores',
    'wifd.rail_prev': 'Episodios más recientes',
    'wifd.rail_next': 'Episodios más viejos',
    'wifd.waitlist_prompt': '¿Quieres enterarte cuando lancemos?',
    'wifd.waitlist_cta': 'Únete a la lista de espera',
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
    'wifd.ep6_tag': 'Episodio 6',
    'wifd.ep6_title': 'Skittles — la bolsa entera',
    'wifd.ep6_body': 'Una bolsa entera, 4 horas en la máquina. Todavía nos sorprende cómo quedan.',
    'wifd.ep6_alt': 'Miniatura del video de TikTok: una bolsa entera de Skittles liofilizados',
    'wifd.ep7_tag': 'Episodio 7',
    'wifd.ep7_title': 'Mantecado — segunda vuelta',
    'wifd.ep7_body': 'Volvimos a meter mantecado en la máquina. Quedó brutal.',
    'wifd.ep7_alt': 'Miniatura del video de TikTok: mantecado liofilizado',
    'wifd.ep8_tag': 'Episodio 8',
    'wifd.ep8_title': 'Quesitos',
    'wifd.ep8_body': 'Le quitamos el agua a unos quesitos y quedaron mejor de lo que esperábamos.',
    'wifd.ep8_alt': 'Miniatura del video de TikTok: quesitos liofilizados',
    'wifd.ep9_tag': 'Episodio 9',
    'wifd.ep9_title': 'Refresco — solo quedó el syrup',
    'wifd.ep9_body': 'Le sacamos el agua a un refresco y quedó solo el syrup. Debimos verlo venir.',
    'wifd.ep9_alt': 'Miniatura del video de TikTok: refresco liofilizado, solo quedó el syrup',
    'wifd.ep10_tag': 'Episodio 10',
    'wifd.ep10_title': 'Roll-ups — sin agua',
    'wifd.ep10_body': 'Fruit roll-ups sin una gota de agua. Jamás nos hubiéramos imaginado cómo iban a quedar.',
    'wifd.ep10_alt': 'Miniatura del video de TikTok: fruit roll-ups liofilizados',
    'nav.faq': 'Preguntas',
    'faq.eyebrow': 'Preguntas',
    'faq.title': 'Antes de que preguntes',
    'faq.q1': '¿Qué es liofilizar?',
    'faq.a1': 'Es sacarle el agua a la comida congelándola y poniéndola al vacío. El hielo pasa a vapor sin derretirse, y lo que queda mantiene su forma con otra textura: crujiente, liviana, a veces irreconocible. Es la técnica de la comida que va al espacio.',
    'faq.q2': '¿Ya puedo comprar?',
    'faq.a2': 'Todavía no. Estamos resolviendo el empaque para que todo llegue como tiene que llegar. Cuando abra la tienda, la lista de espera se entera primero.',
    'faq.q3': '¿Qué van a vender?',
    'faq.a3': 'Para empezar, dulces, mantecados y frutas liofilizadas. Tenemos ideas para mucho más, pero vamos paso a paso.',
    'faq.q4': '¿Van a enviar fuera de Puerto Rico?',
    'faq.a4': 'Esa es la idea. Todavía no hay fecha ni detalles; si estás en la lista de espera, te avisamos.',
    'faq.q5': '¿Cómo los contacto?',
    'faq.a5': 'Escríbenos a moonchies.pr@gmail.com o por Instagram, TikTok o Facebook, por la razón que sea.',
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
    'suggest.again': 'Enviar otra idea',
    'form.sending': 'Enviando…',
    'form.email_required': 'Escribe tu correo para unirte.',
    'form.email_invalid': 'Ese correo no parece completo. Revisa que tenga @ y un dominio, como tu@correo.com.',
    'form.email_suggest': '¿Quisiste decir',
    'form.idea_required': 'Escribe tu idea antes de enviarla.',
    'contact.copy': 'Copiar correo',
    'contact.copied': '¡Correo copiado!',
    'contact.copy_failed': 'No se pudo copiar',
    'share.site': 'Compártelo con alguien',
    'share.episode': 'Compartir',
    'share.copied': '¡Link copiado!',
    'share.site_text': 'Liofilizan lo cotidiano y documentan qué pasa, desde Puerto Rico.',
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
    'waitlist.privacy': 'Cómo usamos tu correo',
    'footer.privacy': 'Privacidad',
    'privacy.meta_title': 'Privacidad — Moonchies',
    'privacy.title': 'Privacidad',
    'privacy.updated': 'Última actualización: 16 de septiembre de 2026',
    'privacy.intro': 'Moonchies es una marca pequeña de Puerto Rico. Recogemos lo mínimo y no vendemos ni compartimos tus datos con nadie.',
    'privacy.waitlist_title': 'Lista de espera',
    'privacy.waitlist_body': 'Si te unes, guardamos tu correo y las opciones que marques en el formulario. Lo usamos solo para avisarte cuando lancemos.',
    'privacy.ideas_title': 'Ideas que nos mandas',
    'privacy.ideas_body': 'Si nos sugieres algo para liofilizar, guardamos el texto que escribiste.',
    'privacy.context_title': 'Lo que acompaña cada formulario',
    'privacy.context_body': 'El idioma en que viste el sitio y, si llegaste desde otro sitio o un enlace de campaña, de dónde vino (por ejemplo, TikTok). Nos ayuda a saber qué publicaciones funcionan.',
    'privacy.stats_title': 'Estadísticas de visitas',
    'privacy.stats_body': 'Usamos Umami, una herramienta que no usa cookies ni te identifica. Vemos números en conjunto: cuántas visitas hay, qué secciones se ven, de qué sitio llega la gente, el país aproximado y el tipo de dispositivo. No vemos quién eres. Si tu navegador tiene activado «Do Not Track», no contamos tu visita.',
    'privacy.browser_title': 'En tu navegador',
    'privacy.browser_body': 'Guardamos tu idioma preferido en tu propio navegador, y durante la visita, de qué enlace llegaste. No son cookies y no salen de tu dispositivo hasta que envías un formulario.',
    'privacy.where_title': 'Dónde se guarda',
    'privacy.where_body': 'Los formularios los recibe Netlify, el servicio donde está alojado este sitio. Las estadísticas las procesa Umami Cloud.',
    'privacy.rights_title': 'Tus datos, tu decisión',
    'privacy.rights_body': '¿Quieres que borremos tu correo o lo que nos enviaste? Escríbenos y lo eliminamos:',
    'privacy.changes_title': 'Cambios',
    'privacy.changes_body': 'Si cambiamos algo aquí, actualizamos la fecha de arriba.',
    'form.error': 'No se pudo enviar. Revisa tu conexión e intenta de nuevo; lo que escribiste sigue ahí. Si sigue fallando, escríbenos por Instagram.',
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
    'hero.cta': 'Join the waitlist',
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
    'wifd.lede': '10 episodes and counting — every experiment, documented, win or fail.',
    'wifd.play_label': 'Watch on TikTok:',
    'wifd.like_label': 'Like on TikTok',
    'wifd.latest': 'Latest',
    'wifd.watch': 'Watch on TikTok',
    'wifd.previous': 'Earlier episodes',
    'wifd.rail_prev': 'Newer episodes',
    'wifd.rail_next': 'Older episodes',
    'wifd.waitlist_prompt': 'Want to know when we launch?',
    'wifd.waitlist_cta': 'Join the waitlist',
    'wifd.ep1_tag': 'Episode 1',
    'wifd.ep1_title': 'Skittles — the first try',
    'wifd.ep1_body': 'What happens when you take the water out of a Skittle? This was our first experiment.',
    'wifd.ep1_alt': 'TikTok video thumbnail: freeze-dried Skittles, first try',
    'wifd.ep2_tag': 'Episode 2',
    'wifd.ep2_title': 'Skittles — round two',
    'wifd.ep2_body': 'Still dialing in the process — here\'s how the texture turned out this time.',
    'wifd.ep2_alt': 'TikTok video thumbnail: freeze-dried Skittles, round two',
    'wifd.ep3_tag': 'Episode 3',
    'wifd.ep3_title': 'Gummy Sharks — the unexpected result',
    'wifd.ep3_body': 'What happens when you take the water out of a gummy shark? We didn\'t see this coming.',
    'wifd.ep3_alt': 'TikTok video thumbnail: freeze-dried gummy sharks',
    'wifd.ep4_tag': 'Episode 4',
    'wifd.ep4_title': 'Vanilla ice cream, with sprinkles',
    'wifd.ep4_body': 'This is what they eat in space — freeze-dried ice cream, without a drop of water.',
    'wifd.ep4_alt': 'TikTok video thumbnail: freeze-dried vanilla ice cream with sprinkles',
    'wifd.ep5_tag': 'Episode 5',
    'wifd.ep5_title': 'Pizza — baked vs. frozen',
    'wifd.ep5_body': 'One baked pizza, one frozen, both 20 hours in the machine. We didn\'t expect this result.',
    'wifd.ep5_alt': 'TikTok video thumbnail: freeze-dried pizza, baked and frozen versions',
    'wifd.ep6_tag': 'Episode 6',
    'wifd.ep6_title': 'Skittles — the whole bag',
    'wifd.ep6_body': 'A whole bag, 4 hours in the machine. It still surprises us how they turn out.',
    'wifd.ep6_alt': 'TikTok video thumbnail: a whole bag of freeze-dried Skittles',
    'wifd.ep7_tag': 'Episode 7',
    'wifd.ep7_title': 'Ice cream — round two',
    'wifd.ep7_body': 'We put ice cream back in the machine. It came out incredible.',
    'wifd.ep7_alt': 'TikTok video thumbnail: freeze-dried ice cream',
    'wifd.ep8_tag': 'Episode 8',
    'wifd.ep8_title': 'Quesitos',
    'wifd.ep8_body': 'We took the water out of some quesitos and they came out better than we expected.',
    'wifd.ep8_alt': 'TikTok video thumbnail: freeze-dried quesitos',
    'wifd.ep9_tag': 'Episode 9',
    'wifd.ep9_title': 'Soda — only the syrup survived',
    'wifd.ep9_body': 'We took the water out of a soda and only the syrup was left. Should\'ve seen that coming.',
    'wifd.ep9_alt': 'TikTok video thumbnail: freeze-dried soda, only the syrup left',
    'wifd.ep10_tag': 'Episode 10',
    'wifd.ep10_title': 'Roll-ups — no water',
    'wifd.ep10_body': 'Fruit roll-ups without a drop of water. We never would have imagined how they\'d turn out.',
    'wifd.ep10_alt': 'TikTok video thumbnail: freeze-dried fruit roll-ups',
    'nav.faq': 'FAQ',
    'faq.eyebrow': 'Questions',
    'faq.title': 'Before you ask',
    'faq.q1': 'What is freeze-drying?',
    'faq.a1': 'It\'s taking the water out of food by freezing it and putting it under a vacuum. The ice turns straight into vapor without melting, and what\'s left keeps its shape with a whole new texture: crunchy, light, sometimes unrecognizable. It\'s the same technique used for food that goes to space.',
    'faq.q2': 'Can I buy yet?',
    'faq.a2': 'Not yet. We\'re sorting out packaging so everything arrives the way it should. When the store opens, the waitlist hears first.',
    'faq.q3': 'What will you sell?',
    'faq.a3': 'To start: freeze-dried candy, ice cream and fruit. We have ideas for a lot more, but we\'re taking it one step at a time.',
    'faq.q4': 'Will you ship outside Puerto Rico?',
    'faq.a4': 'That\'s the plan. There\'s no date or details yet; if you\'re on the waitlist, we\'ll let you know.',
    'faq.q5': 'How do I reach you?',
    'faq.a5': 'Email us at moonchies.pr@gmail.com or message us on Instagram, TikTok or Facebook, for whatever reason.',
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
    'suggest.again': 'Send another idea',
    'form.sending': 'Sending…',
    'form.email_required': 'Enter your email to join.',
    'form.email_invalid': "That email doesn't look complete. Check that it has an @ and a domain, like you@email.com.",
    'form.email_suggest': 'Did you mean',
    'form.idea_required': 'Write your idea before sending it.',
    'contact.copy': 'Copy email',
    'contact.copied': 'Email copied!',
    'contact.copy_failed': "Couldn't copy",
    'share.site': 'Share it with someone',
    'share.episode': 'Share',
    'share.copied': 'Link copied!',
    'share.site_text': 'They freeze-dry everyday things and document what happens, from Puerto Rico.',
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
    'waitlist.privacy': 'How we use your email',
    'footer.privacy': 'Privacy',
    'privacy.meta_title': 'Privacy — Moonchies',
    'privacy.title': 'Privacy',
    'privacy.updated': 'Last updated: September 16, 2026',
    'privacy.intro': "Moonchies is a small brand from Puerto Rico. We collect the minimum, and we don't sell or share your data with anyone.",
    'privacy.waitlist_title': 'Waitlist',
    'privacy.waitlist_body': "If you join, we keep your email and the options you check on the form. We only use it to let you know when we launch.",
    'privacy.ideas_title': 'Ideas you send us',
    'privacy.ideas_body': 'If you suggest something to freeze-dry, we keep the text you wrote.',
    'privacy.context_title': 'What comes with each form',
    'privacy.context_body': 'The language you viewed the site in and, if you arrived from another site or a campaign link, where you came from (for example, TikTok). It helps us know which posts work.',
    'privacy.stats_title': 'Visit statistics',
    'privacy.stats_body': "We use Umami, a tool that doesn't use cookies or identify you. We see totals: how many visits, which sections get seen, which site people come from, approximate country and device type. We don't see who you are. If your browser has \u201cDo Not Track\u201d turned on, your visit isn't counted.",
    'privacy.browser_title': 'In your browser',
    'privacy.browser_body': "We save your preferred language in your own browser and, during your visit, which link brought you here. These aren't cookies, and they don't leave your device unless you send a form.",
    'privacy.where_title': "Where it's stored",
    'privacy.where_body': 'Forms are received by Netlify, the service that hosts this site. Statistics are processed by Umami Cloud.',
    'privacy.rights_title': 'Your data, your call',
    'privacy.rights_body': "Want us to delete your email or anything you sent? Write to us and we'll delete it:",
    'privacy.changes_title': 'Changes',
    'privacy.changes_body': 'If we change anything here, we update the date at the top.',
    'form.error': "Couldn't send. Check your connection and try again; what you wrote is still there. If it keeps failing, message us on Instagram.",
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

  var fromUrl = new URLSearchParams(window.location.search).get('lang');
  var saved = readStorage(STORAGE_KEY);
  var initial = fromUrl === 'en' || fromUrl === 'es' ? fromUrl : saved;
  applyLang(initial === 'en' || initial === 'es' ? initial : 'es');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = document.documentElement.lang === 'en' ? 'es' : 'en';
      applyLang(next);
      window.MoonchiesTrack('language-switch', { to: next });
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

/* ---------- Will It Freeze Dry: episodes open the exact video on TikTok ---------- */
// Embedding TikTok's player inline proved unreliable (broken layout, slow blank
// loads, unrelated "related videos"), so each episode is a plain link that
// opens the exact video in a new tab — still a real view/like on TikTok.

// Thumbnails fade in once decoded; the tile shows a calm placeholder until then.
(function () {
  document.querySelectorAll('.wifd-thumb').forEach(function (img) {
    function done() { img.classList.add('is-loaded'); }
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    }
  });
})();

// Earlier-episodes rail: arrow buttons page through it, and disable at either end.
(function () {
  var rail = document.getElementById('wifdRail');
  if (!rail) return;
  var prev = document.querySelector('[data-rail="prev"]');
  var next = document.querySelector('[data-rail="next"]');

  function step() {
    var card = rail.querySelector('.wifd-card');
    if (!card) return rail.clientWidth;
    var gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    var perView = Math.max(1, Math.floor((rail.clientWidth + gap) / (card.offsetWidth + gap)));
    return perView * (card.offsetWidth + gap);
  }

  function update() {
    var max = rail.scrollWidth - rail.clientWidth - 2;
    if (prev) prev.disabled = rail.scrollLeft <= 2;
    if (next) next.disabled = rail.scrollLeft >= max;
  }

  function go(direction) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    rail.scrollBy({ left: direction * step(), behavior: reduced ? 'auto' : 'smooth' });
  }

  if (prev) prev.addEventListener('click', function () { go(-1); });
  if (next) next.addEventListener('click', function () { go(1); });
  rail.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* ---------- shared helpers: translate, announce, copy ---------- */
function t(key) {
  var dict = I18N[document.documentElement.lang] || I18N.es;
  return dict[key] !== undefined ? dict[key] : (I18N.es[key] || '');
}

// Swap an element's text to another dictionary key, keeping it in sync with the language toggle.
function setText(el, key) {
  el.setAttribute('data-i18n', key);
  el.textContent = t(key);
}

function announce(message) {
  var region = document.getElementById('liveRegion');
  if (!region) return;
  region.textContent = '';
  setTimeout(function () { region.textContent = message; }, 50);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise(function (resolve, reject) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.className = 'visually-hidden';
    document.body.appendChild(area);
    area.select();
    try { if (document.execCommand('copy')) resolve(); else reject(new Error('copy failed')); }
    catch (e) { reject(e); }
    finally { area.remove(); }
  });
}

// Briefly show a confirmation on a button's label, then restore it.
function flashLabel(button, key) {
  var label = button.querySelector('.btn-label');
  if (!label) return;
  var original = button.getAttribute('data-label-key') || label.getAttribute('data-i18n');
  button.setAttribute('data-label-key', original);
  setText(label, key);
  button.classList.add('is-done');
  announce(t(key));
  clearTimeout(button._flashTimer);
  button._flashTimer = setTimeout(function () {
    setText(label, original);
    button.classList.remove('is-done');
  }, 2200);
}

/* ---------- attribution: which campaign/site brought this visit ---------- */
// First touch per browser session. Sent with form submissions so each signup
// shows where it came from (e.g. ?utm_source=tiktok&utm_medium=bio).
var Attribution = (function () {
  var KEY = 'moonchies_attr';
  var stored = {};
  try { stored = JSON.parse(window.sessionStorage.getItem(KEY) || '{}') || {}; } catch (e) { stored = {}; }

  var params = new URLSearchParams(window.location.search);
  var fromUrl = {};
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (name) {
    var value = params.get(name);
    if (value) fromUrl[name] = value.slice(0, 100);
  });

  var referrer = '';
  try {
    if (document.referrer) {
      var host = new URL(document.referrer).hostname;
      if (host && host !== window.location.hostname) referrer = host;
    }
  } catch (e) { /* malformed referrer */ }

  var data = stored;
  if (Object.keys(fromUrl).length) data = Object.assign({}, fromUrl, { referido: stored.referido || referrer });
  else if (!stored.referido && referrer) data = Object.assign({}, stored, { referido: referrer });

  try { window.sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage blocked */ }
  return data;
})();

/* ---------- Netlify forms: validation, loading state, AJAX submit ---------- */
var EMAIL_DOMAIN_FIXES = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gmal.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com', 'gmail.cm': 'gmail.com', 'gnail.com': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com', 'yahoo.co': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'outlok.com': 'outlook.com', 'outlook.co': 'outlook.com', 'outlook.con': 'outlook.com',
  'iclod.com': 'icloud.com', 'icloud.co': 'icloud.com', 'icloud.con': 'icloud.com'
};

function fieldProblem(field) {
  var value = field.value.trim();
  if (field.getAttribute('data-validate') === 'email') {
    if (!value) return 'form.email_required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'form.email_invalid';
    return '';
  }
  return value ? '' : 'form.idea_required';
}

function showFieldProblem(field, key) {
  var error = document.getElementById(field.getAttribute('aria-describedby'));
  if (key) {
    field.setAttribute('aria-invalid', 'true');
    if (error) { setText(error, key); error.hidden = false; }
  } else {
    field.removeAttribute('aria-invalid');
    if (error) { error.removeAttribute('data-i18n'); error.textContent = ''; error.hidden = true; }
  }
}

function suggestEmail(field) {
  var box = document.getElementById('email-suggest');
  if (!box) return;
  var value = field.value.trim();
  var at = value.lastIndexOf('@');
  var fix = at > 0 ? EMAIL_DOMAIN_FIXES[value.slice(at + 1).toLowerCase()] : null;
  box.textContent = '';
  box.hidden = !fix;
  if (!fix) return;
  var corrected = value.slice(0, at + 1) + fix;
  var button = document.createElement('button');
  button.type = 'button';
  button.className = 'text-btn email-suggest';
  var prefix = document.createElement('span');
  prefix.setAttribute('data-i18n', 'form.email_suggest');
  prefix.textContent = t('form.email_suggest');
  var strong = document.createElement('strong');
  strong.textContent = corrected;
  button.appendChild(prefix);
  button.appendChild(document.createTextNode(' '));
  button.appendChild(strong);
  button.appendChild(document.createTextNode('?'));
  button.addEventListener('click', function () {
    field.value = corrected;
    box.hidden = true;
    box.textContent = '';
    showFieldProblem(field, '');
    field.focus();
  });
  box.appendChild(button);
}

function wireNetlifyForm(formId, confirmId, onSuccess) {
  var form = document.getElementById(formId);
  var confirmEl = document.getElementById(confirmId);
  if (!form || !confirmEl) return;
  var submit = form.querySelector('[type="submit"]');
  var label = submit.querySelector('.btn-label');
  var labelKey = label.getAttribute('data-i18n');
  var fields = form.querySelectorAll('[data-validate]');
  var sending = false;

  // Script-driven validation replaces the browser bubbles (which ignore the page language).
  form.setAttribute('novalidate', '');

  fields.forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') showFieldProblem(field, fieldProblem(field));
    });
    if (field.getAttribute('data-validate') === 'email') {
      field.addEventListener('blur', function () { suggestEmail(field); });
    }
  });

  function setBusy(busy) {
    submit.disabled = busy;
    submit.classList.toggle('is-busy', busy);
    submit.setAttribute('aria-busy', String(busy));
    setText(label, busy ? 'form.sending' : labelKey);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;

    var firstBad = null;
    fields.forEach(function (field) {
      var key = fieldProblem(field);
      showFieldProblem(field, key);
      if (key && !firstBad) firstBad = field;
    });
    if (firstBad) { firstBad.focus(); return; }

    var context = {
      idioma: document.documentElement.lang,
      utm_source: Attribution.utm_source || '',
      utm_medium: Attribution.utm_medium || '',
      utm_campaign: Attribution.utm_campaign || '',
      referido: Attribution.referido || ''
    };
    Object.keys(context).forEach(function (name) {
      if (form.elements[name]) form.elements[name].value = context[name];
    });

    sending = true;
    setBusy(true);
    confirmEl.classList.remove('show', 'error');

    var controller = 'AbortController' in window ? new AbortController() : null;
    var timeout = setTimeout(function () { if (controller) controller.abort(); }, 15000);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status ' + res.status);
        form.reset();
        form.hidden = true;
        confirmEl.classList.add('show');
        confirmEl.focus();
        if (onSuccess) onSuccess();
      })
      .catch(function () {
        // Keep what the person typed; show a recoverable error below the form.
        confirmEl.classList.add('show', 'error');
        announce(t('form.error'));
      })
      .then(function () {
        clearTimeout(timeout);
        sending = false;
        setBusy(false);
      });
  });
}

wireNetlifyForm('waitlistForm', 'waitlistConfirm', function () {
  if (window.MoonchiesTrack) window.MoonchiesTrack('waitlist-signup');
});
wireNetlifyForm('suggestForm', 'suggestConfirm', function () {
  if (window.MoonchiesTrack) window.MoonchiesTrack('idea-sent');
});

(function () {
  var again = document.getElementById('suggestAgain');
  if (!again) return;
  again.addEventListener('click', function () {
    var form = document.getElementById('suggestForm');
    document.getElementById('suggestConfirm').classList.remove('show', 'error');
    form.hidden = false;
    form.querySelector('textarea').focus();
  });
})();

/* ---------- copy email, share ---------- */
document.querySelectorAll('.copy-btn[data-copy]').forEach(function (button) {
  button.addEventListener('click', function () {
    copyText(button.getAttribute('data-copy'))
      .then(function () {
        flashLabel(button, 'contact.copied');
        if (window.MoonchiesTrack) window.MoonchiesTrack('email-copied');
      })
      .catch(function () { flashLabel(button, 'contact.copy_failed'); });
  });
});

document.querySelectorAll('.share-btn').forEach(function (button) {
  button.addEventListener('click', function () {
    var isEpisode = button.getAttribute('data-share') === 'episode';
    var titleEl = document.getElementById(button.getAttribute('data-share-title-id') || '');
    var data = isEpisode
      ? { title: 'Will It Freeze Dry? — ' + (titleEl ? titleEl.textContent : 'Moonchies'), url: button.getAttribute('data-share-url') }
      : { title: 'Moonchies', text: t('share.site_text'), url: 'https://moonchiespr.com/' };

    if (window.MoonchiesTrack) window.MoonchiesTrack(isEpisode ? 'share-episode' : 'share-site');

    if (navigator.share) {
      navigator.share(data).catch(function () { /* closed the share sheet */ });
      return;
    }
    copyText(data.url)
      .then(function () { flashLabel(button, 'share.copied'); })
      .catch(function () { flashLabel(button, 'contact.copy_failed'); });
  });
});

/* ---------- FAQ: which questions get opened ---------- */
document.querySelectorAll('.faq-item').forEach(function (item) {
  item.addEventListener('toggle', function () {
    if (item.open) window.MoonchiesTrack('faq-open', { question: item.getAttribute('data-faq') });
  });
});
