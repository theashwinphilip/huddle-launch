(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Reveal content as it enters the viewport.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Slow pointer parallax keeps the ambient glow alive on larger screens.
  if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glows = $$('.ambient');
    window.addEventListener('pointermove', event => {
      const x = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 18;
      const y = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 18;
      glows.forEach((glow, index) => {
        const direction = index === 0 ? 1 : -0.7;
        glow.style.marginLeft = `${x * direction}px`;
        glow.style.marginTop = `${y * direction}px`;
      });
    }, { passive: true });
  }

  // Scroll progress indicator.
  const progressBar = $('#scroll-progress-bar');
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Mobile navigation.
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.classList.toggle('open', open);
  });
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('open');
  }));

  // Active navigation state based on the section in view.
  const navLinks = $$('.nav-link');
  const sections = ['home', 'experience', 'about', 'contact'].map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(section => navObserver.observe(section));
  }

  // Product-story carousel. Automatically advances, with manual controls and pause on hover.
  const slides = [
    {
      tag: 'SHARED EXPERIENCES', title: 'One event.<br />Everyone’s memories.',
      description: 'Bring photos, people and plans together in one shared event space — before, during and long after it happens.',
      main: 'assets/goa-beach.webp', top: 'assets/goa-car.webp', bottom: 'assets/goa-lunch.webp',
      altMain: 'Friends enjoying a beach trip', altTop: 'Friends travelling together', altBottom: 'Friends sharing a meal', index: 'GOA DIARIES / 2026'
    },
    {
      tag: 'EVERYDAY INSTANTS', title: 'Little moments.<br />Real life.',
      description: 'Share what you’re up to, keep a personal activity private or let nearby friends join in when the moment is right.',
      main: 'assets/instant-class.webp', top: 'assets/instant-chai.webp', bottom: 'assets/instant-basketball.webp',
      altMain: 'A notebook in a classroom', altTop: 'A chai break', altBottom: 'Friends playing basketball', index: 'A DAY IN THE MIX / 001'
    },
    {
      tag: 'YOUR PEOPLE, YOUR PLANS', title: 'Find your crew.<br />Make it happen.',
      description: 'From weekend escapes to birthday nights, discover things around you and invite the people who make them better.',
      main: 'assets/event-trek.webp', top: 'assets/event-birthday.webp', bottom: 'assets/event-jam.webp',
      altMain: 'Friends hiking in the hills', altTop: 'Friends celebrating a birthday', altBottom: 'Friends playing music together', index: 'PLANS WITH YOUR PEOPLE / 002'
    },
    {
      tag: 'MEMORIES THAT STAY', title: 'The best part?<br />Looking back.',
      description: 'A shared album, a timeline and a recap — one home for the moments everyone helped make.',
      main: 'assets/memory-friends.webp', top: 'assets/memory-road.webp', bottom: 'assets/memory-cafe.webp',
      altMain: 'Friends sharing a relaxed moment', altTop: 'A road trip memory', altBottom: 'Friends catching up at a cafe', index: 'THE MEMORY LANE / 003'
    }
  ];
  let activeSlide = 0;
  let carouselTimer;
  const showcase = $('#showcase-visual');
  const setSlide = index => {
    activeSlide = (index + slides.length) % slides.length;
    const slide = slides[activeSlide];
    const imageMain = $('#slide-image-main');
    const imageTop = $('#slide-image-top');
    const imageBottom = $('#slide-image-bottom');
    [imageMain, imageTop, imageBottom].forEach(img => img.classList.add('is-changing'));
    $('#slide-copy-inner').classList.add('is-changing');
    window.setTimeout(() => {
      imageMain.src = slide.main; imageMain.alt = slide.altMain;
      imageTop.src = slide.top; imageTop.alt = slide.altTop;
      imageBottom.src = slide.bottom; imageBottom.alt = slide.altBottom;
      $('#slide-tag').textContent = slide.tag;
      $('#slide-title').innerHTML = slide.title;
      $('#slide-description').textContent = slide.description;
      $('#visual-index').textContent = slide.index;
      $('#slide-current').textContent = String(activeSlide + 1).padStart(2, '0');
      $$('.slide-dot').forEach((dot, i) => dot.classList.toggle('active', i === activeSlide));
      [imageMain, imageTop, imageBottom].forEach(img => img.classList.remove('is-changing'));
      $('#slide-copy-inner').classList.remove('is-changing');
    }, 160);
  };
  const restartCarousel = () => {
    window.clearInterval(carouselTimer);
    carouselTimer = window.setInterval(() => setSlide(activeSlide + 1), 6200);
  };
  $('#slide-prev').addEventListener('click', () => { setSlide(activeSlide - 1); restartCarousel(); });
  $('#slide-next').addEventListener('click', () => { setSlide(activeSlide + 1); restartCarousel(); });
  $$('.slide-dot').forEach(dot => dot.addEventListener('click', () => { setSlide(Number(dot.dataset.slide)); restartCarousel(); }));
  showcase.addEventListener('mouseenter', () => window.clearInterval(carouselTimer));
  showcase.addEventListener('mouseleave', restartCarousel);
  restartCarousel();

  // Early-access CTA: without a mailing-list backend, compose an email rather than implying a signup was stored.
  $('#early-form').addEventListener('submit', event => {
    event.preventDefault();
    const email = $('#early-email').value.trim();
    if (!email) return;
    const subject = encodeURIComponent('huddle. — early access');
    const body = encodeURIComponent(`Hi huddle. team,\n\nPlease add me to the early-access list.\n\nMy email: ${email}\n\nThanks!`);
    $('#form-note').textContent = 'Your email app should open with an early-access request ready to send.';
    window.location.href = `mailto:ashwinphilip.work@gmail.com?subject=${subject}&body=${body}`;
  });

  $('#year').textContent = new Date().getFullYear();
})();
