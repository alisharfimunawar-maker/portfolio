/* ============================================
   PORTFOLIO JAVASCRIPT
   All interactive features for the portfolio
   ============================================ */

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
  const loader = document.querySelector('.loading-screen');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }
});

// ===== RUN ON DOM READY =====
document.addEventListener('DOMContentLoaded', () => {

  // --- NAVBAR SCROLL EFFECT ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // --- MOBILE HAMBURGER MENU ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // --- SCROLL PROGRESS BAR ---
  const scrollProgress = document.querySelector('.scroll-progress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      scrollProgress.style.width = progress + '%';
    });
  }

  // --- BACK TO TOP BUTTON ---
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- ANIMATED COUNTERS ---
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = Math.ceil(target / 50);
        const updateCounter = () => {
          current += increment;
          if (current >= target) {
            el.textContent = target + (el.dataset.suffix || '');
          } else {
            el.textContent = current + (el.dataset.suffix || '');
            requestAnimationFrame(updateCounter);
          }
        };
        updateCounter();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  // --- ANIMATED PROGRESS BARS ---
  const progressBars = document.querySelectorAll('.progress-fill');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const value = bar.dataset.value;
        bar.style.width = value + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });
  progressBars.forEach(b => barObserver.observe(b));

  // --- CIRCULAR PROGRESS ANIMATIONS ---
  const circularRings = document.querySelectorAll('.circular-progress .fg-ring');
  const circularObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const ring = entry.target;
        const percent = parseInt(ring.dataset.percent);
        const offset = 314 - (314 * percent / 100);
        ring.style.strokeDashoffset = offset;
        // Animate the number
        const textEl = ring.closest('.circular-progress').querySelector('.percent');
        let current = 0;
        const increment = Math.ceil(percent / 40);
        const updateNum = () => {
          current += increment;
          if (current >= percent) {
            textEl.textContent = percent + '%';
          } else {
            textEl.textContent = current + '%';
            requestAnimationFrame(updateNum);
          }
        };
        updateNum();
        circularObserver.unobserve(ring);
      }
    });
  }, { threshold: 0.3 });
  circularRings.forEach(r => circularObserver.observe(r));

  // --- 3D CARD TILT EFFECT ---
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  // --- PROJECT FILTERING ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      // Filter cards
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --- TYPING EFFECT (Hero) ---
  const typer = document.querySelector('.typer');
  if (typer) {
    const words = JSON.parse(typer.dataset.words || '["Web Developer", "UI/UX Designer"]');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    function typeLoop() {
      const currentWord = words[wordIndex];
      if (!isDeleting) {
        typer.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(typeLoop, pauseTime);
          return;
        }
        setTimeout(typeLoop, typeSpeed);
      } else {
        typer.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
        setTimeout(typeLoop, deleteSpeed);
      }
    }
    typeLoop();
  }

  // --- MOUSE PARALLAX ON HERO VISUAL ---
  const heroVisual = document.querySelector('.hero-visual');
  const heroOrb = document.querySelector('.hero-orb');
  if (heroVisual && heroOrb) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      heroOrb.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      heroOrb.style.transform = 'translate(0, 0)';
    });
  }

  // --- PARTICLES BACKGROUND ---
  const particlesBg = document.querySelector('.particles-bg');
  if (particlesBg) {
    const particleCount = 25;
    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (Math.random() * 10 + 10) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      const size = Math.random() * 4 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.opacity = Math.random() * 0.4 + 0.1;
      particlesBg.appendChild(p);
    }
  }

  // --- CONTACT FORM VALIDATION ---
  const contactForm = document.querySelector('.contact-form-inner');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(err => err.classList.remove('show'));

      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const subject = contactForm.querySelector('#subject');
      const message = contactForm.querySelector('#message');

      // Validate name
      if (name.value.trim().length < 2) {
        contactForm.querySelector('#name-error').classList.add('show');
        valid = false;
      }
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        contactForm.querySelector('#email-error').classList.add('show');
        valid = false;
      }
      // Validate subject
      if (subject.value.trim().length < 2) {
        contactForm.querySelector('#subject-error').classList.add('show');
        valid = false;
      }
      // Validate message
      if (message.value.trim().length < 10) {
        contactForm.querySelector('#message-error').classList.add('show');
        valid = false;
      }

      if (valid) {
        const success = contactForm.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
          contactForm.reset();
          setTimeout(() => success.classList.remove('show'), 5000);
        }
      }
    });
  }

  // --- PAGE FADE IN ---
  const pageWrapper = document.querySelector('.page-wrapper');
  if (pageWrapper) {
    pageWrapper.classList.add('fade-in');
  }
});

// ===== CUSTOM CURSOR (desktop only) =====
if (window.innerWidth > 768) {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorRing = document.createElement('div');
  cursorRing.className = 'cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  // Smooth follow for ring
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Grow cursor on hoverable elements
  document.querySelectorAll('a, button, [data-tilt], input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('grow'));
  });
}
