
// Move each row of services in opposite directions on scroll
window.addEventListener('scroll', function() {
  const serviceRows = document.querySelectorAll('.services-row');
  const scrollY = window.scrollY;

  serviceRows.forEach((row, i) => {
    const direction = i % 2 === 0 ? 1 : -1;
    const x = direction * scrollY * 0.06;
    row.style.transform = `translateX(${x}px)`;
  });
});

// Optional: Reset transform when page is loaded/refreshed
window.addEventListener('DOMContentLoaded', () => {
  const serviceRows = document.querySelectorAll('.services-row');
  serviceRows.forEach(row => {
    row.style.transform = '';
  });

  // Active nav link highlight
  const sections = document.querySelectorAll('#home, #services, #about, #contact');
  const navLinks = document.querySelectorAll('nav a');

  function updateActiveLink() {
    let index = 0;
    for (let i = 0; i < sections.length; i++) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.35) {
        index = i;
      }
    }

    navLinks.forEach(link => link.classList.remove('active'));
    const activeSectionId = sections[index].id || 'home';
    const active = document.querySelector(`nav a[href="#${activeSectionId}"]`);
    if (active) active.classList.add('active');
  }

  window.addEventListener('scroll', updateActiveLink);

  // Header and top-bar animation
  const topBar = document.querySelector('.top-bar');
  const header = document.querySelector('header');
  const hero = document.getElementById('home');

  function updateHeaderState() {
    if (!hero || !header || !topBar) return;
    const heroBottom = hero.getBoundingClientRect().bottom;
    const threshold = 10; // top of hero has left viewport
    const logoImg = document.querySelector('.logo img');
    if (heroBottom <= threshold) {
      topBar.classList.add('scrolled');
      topBar.classList.remove('compact');
      header.classList.add('shrink');
      if (logoImg) {
        logoImg.src = 'Ray Visuals logo.png';
        logoImg.style.width = '75px';
      }
    } else {
      topBar.classList.remove('scrolled');
      topBar.classList.remove('compact');
      header.classList.remove('shrink');
      if (logoImg) {
        logoImg.src = 'Ray Visuals logo white.png';
        logoImg.style.width = '100px';
      }
    }
  }

  window.addEventListener('scroll', updateHeaderState);
  updateHeaderState();

  updateActiveLink();

  // Contact form submission stub
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      alert('Thanks! Your message has been received. We will respond within 24 hours.');
      form.reset();
    });
  }

  // Mobile menu toggle
  const menuBtn = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('primary-nav');
  if (menuBtn && nav) {
    function updateMobileMenuMode() {
      if (window.innerWidth <= 900 && header.classList.contains('shrink')) {
        nav.classList.add('scrolled');
        menuBtn.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
        menuBtn.classList.remove('scrolled');
      }
    }

    menuBtn.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuBtn.classList.toggle('open', isOpen);
      const expanded = nav.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', expanded);
      updateMobileMenuMode();
    });

    window.addEventListener('scroll', updateMobileMenuMode);
    window.addEventListener('resize', updateMobileMenuMode);

    const navItems = nav.querySelectorAll('a');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.forEach(link => link.classList.remove('active'));
        item.classList.add('active');

        if (window.innerWidth <= 900) {
          nav.classList.remove('open');
          menuBtn.classList.remove('open');
          menuBtn.setAttribute('aria-expanded', 'false');
        }

        setTimeout(updateActiveLink, 100); // sync after smooth scroll move
      });
    });
  }

  // Highlight2 rotating label (social style dynamic keyword)
  const highlight2 = document.querySelector('.highlight2');
  if (highlight2) {
    const words = ['BUSINESS', 'EVENT', 'OFFICE', 'CEREMONY', 'WEBSITE', 'APPLICATION'];
    let wordIndex = 0;

    const rotateHighlight = () => {
      highlight2.classList.add('fade-out');
      highlight2.classList.remove('fade-in');
    };

    highlight2.addEventListener('transitionend', (event) => {
      if (event.propertyName !== 'opacity') return;
      if (!highlight2.classList.contains('fade-out')) return;

      wordIndex = (wordIndex + 1) % words.length;
      highlight2.textContent = words[wordIndex];
      highlight2.classList.remove('fade-out');
      highlight2.classList.add('fade-in');
    });

    // start with current text visible
    highlight2.classList.add('fade-in');
    setInterval(rotateHighlight, 2500);
  }

  // Stats counter animation (run when #stats is in view)
  const statValues = document.querySelectorAll('.stat-value');
  const runStatCounter = () => {
    statValues.forEach(stat => {
      const target = parseInt(stat.dataset.target, 10);
      if (isNaN(target) || target <= 0) return;

      let start = 0;
      const duration = 1400;
      const stepTime = Math.max(Math.floor(duration / target), 20);

      const counter = setInterval(() => {
        start += Math.ceil(target / (duration / stepTime));
        if (start >= target) {
          stat.textContent = target;
          clearInterval(counter);
        } else {
          stat.textContent = start;
        }
      }, stepTime);
    });
  };

  const statsSection = document.getElementById('stats');
  if (statsSection && statValues.length > 0) {
    let statsRun = false;
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsRun) {
          statsRun = true;
          runStatCounter();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    observer.observe(statsSection);
  }

});