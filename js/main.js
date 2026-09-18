document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     FOOTER YEAR
     ============================================================ */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ============================================================
     NAVBAR: scroll state, mobile toggle, active link tracking
     ============================================================ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');

  const onScrollNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
    navToggle.classList.toggle('open');
  });
  document.getElementById('navMenuWrap').querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('nav-open');
      navToggle.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => navObserver.observe(s));

  /* ============================================================
     CURSOR GLOW
     ============================================================ */
  const glow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive: true });

  /* ============================================================
     SCROLL REVEAL (generic)
     ============================================================ */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(el => {
    const delay = el.getAttribute('data-delay');
    if (delay) el.style.setProperty('--reveal-delay', delay);
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============================================================
     TYPING EFFECT — hero name in rotating "code" syntax
     ============================================================ */
  const NAME = 'Manjurul Alam Mahi';
  const codeVariants = [
    `<?php echo "${NAME}"; ?>`,
    `const name = '${NAME}';`,
    `{{ $name = '${NAME}' }}`,
    `let dev: string = "${NAME}";`,
    `<h1>${NAME}</h1>`,
    `SELECT '${NAME}' AS name;`,
    `console.log("${NAME}");`
  ];

  const typedEl = document.getElementById('typedName');
  let variantIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = codeVariants[variantIndex];

    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        return setTimeout(typeLoop, 1800);
      }
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        variantIndex = (variantIndex + 1) % codeVariants.length;
        return setTimeout(typeLoop, 400);
      }
    }
    setTimeout(typeLoop, deleting ? 28 : 55);
  }
  typeLoop();

  /* ============================================================
     HERO FLOATING CODE PARTICLES + mouse repel
     ============================================================ */
  const snippets = [
    '<?php', '$user->save();', 'Route::get()', 'php artisan serve',
    'class Controller', 'public function index()', 'composer require',
    'const app = () =>', 'import React', 'async/await', 'export default',
    'npm run dev', '{{ $item->name }}', '@foreach($items as $i)',
    'SELECT * FROM users', 'git commit -m', "try { } catch(e) {}",
    'function fetchData()', 'new Vue({})', '$http.get("/api")',
    '</>', '{ }', '=> {}', 'return response()->json();'
  ];

  const floatContainer = document.getElementById('floatingCode');
  const floatEls = [];

  snippets.forEach((text) => {
    const wrap = document.createElement('div');
    wrap.className = 'code-float';
    const top = Math.random() * 92;
    const left = Math.random() * 92;
    wrap.style.top = top + '%';
    wrap.style.left = left + '%';

    const inner = document.createElement('span');
    inner.className = 'code-float__inner';
    inner.textContent = text;
    inner.style.fontSize = (0.75 + Math.random() * 0.9).toFixed(2) + 'rem';
    inner.style.animationDuration = (5 + Math.random() * 5).toFixed(1) + 's';
    inner.style.animationDelay = (Math.random() * 4).toFixed(1) + 's';

    wrap.appendChild(inner);
    floatContainer.appendChild(wrap);
    floatEls.push(wrap);
  });

  const heroSection = document.querySelector('.hero');
  let heroRect = heroSection.getBoundingClientRect();
  window.addEventListener('resize', () => { heroRect = heroSection.getBoundingClientRect(); }, { passive: true });

  let mouseX = -9999, mouseY = -9999;
  let ticking = false;
  const REPEL_RADIUS = 170;
  const REPEL_STRENGTH = 60;

  function updateFloatPositions() {
    floatEls.forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - mouseX;
      const dy = cy - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPEL_RADIUS) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        const angle = Math.atan2(dy, dx);
        el.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
    ticking = false;
  }

  heroSection.addEventListener('mousemove', (e) => {
    heroRect = heroSection.getBoundingClientRect();
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      requestAnimationFrame(updateFloatPositions);
      ticking = true;
    }
  }, { passive: true });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = -9999; mouseY = -9999;
    floatEls.forEach(el => { el.style.transform = 'translate(0, 0)'; });
  });

  /* ============================================================
     ABOUT AVATAR — rotating tech badge
     ============================================================ */
  const badges = [
    { name: 'Laravel', icon: 'devicon-laravel-plain', bg: '#FF2D20' },
    { name: 'PHP', icon: 'devicon-php-plain', bg: '#777BB4' },
    { name: 'JavaScript', icon: 'devicon-javascript-plain', bg: '#F0DB4F', text: '#1F241B' },
    { name: 'Vue.js', icon: 'devicon-vuejs-plain', bg: '#4FC08D' },
    { name: 'MySQL', icon: 'devicon-mysql-plain', bg: '#4479A1' },
  ];
  const badgeEl = document.getElementById('techBadge');
  let badgeIndex = 0;

  function rotateBadge() {
    badgeIndex = (badgeIndex + 1) % badges.length;
    const b = badges[badgeIndex];
    badgeEl.classList.add('pulse');
    setTimeout(() => {
      badgeEl.style.background = b.bg;
      badgeEl.style.color = b.text || '#fff';
      badgeEl.innerHTML = `<i class="${b.icon}"></i><span>${b.name}</span>`;
      badgeEl.classList.remove('pulse');
    }, 220);
  }
  setInterval(rotateBadge, 2600);

  /* ============================================================
     STAT COUNTERS
     ============================================================ */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));
      const tick = () => {
        current += step;
        if (current >= target) { el.textContent = target; return; }
        el.textContent = current;
        requestAnimationFrame(tick);
      };
      tick();
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  /* ============================================================
     SKILL BARS — animate width on reveal
     ============================================================ */
  const skillFills = document.querySelectorAll('.skill-bar__fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width') + '%';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach(f => skillObserver.observe(f));

});
