/* VEXUM // main interactions */
(function () {
  // --- hero typing + glitch reveal ---
  const glitchEl = document.getElementById('glitch-text');
  const caret = document.getElementById('hero-caret');
  const PHRASE = 'ARE YOU 0 OR 1?';

  if (glitchEl) {
    const SCRAMBLE = '01!<>-_\\/[]{}#$%&';
    let i = 0;
    function typeNext() {
      if (i <= PHRASE.length) {
        const settled = PHRASE.slice(0, i);
        const noise = i < PHRASE.length ? SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)] : '';
        glitchEl.textContent = settled + noise;
        i++;
        setTimeout(typeNext, 90 + Math.random() * 70);
      } else {
        glitchEl.textContent = PHRASE;
        glitchEl.setAttribute('data-text', PHRASE);
        glitchEl.classList.add('glitch--on');
        if (caret) caret.style.display = 'none';
      }
    }
    setTimeout(typeNext, 700);
  }

  // --- hero clock ---
  const clockEl = document.getElementById('hero-clock');
  if (clockEl) {
    setInterval(() => {
      clockEl.textContent = new Date().toLocaleTimeString('en-GB');
    }, 1000);
  }

  // --- scroll reveal via IntersectionObserver ---
  const snap = document.getElementById('snap');
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('in-view'); }),
    { root: snap, threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // --- mobile nav ---
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        links.classList.remove('open');
      })
    );
  }

  // --- anchor nav scrolls inside snap container ---
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
