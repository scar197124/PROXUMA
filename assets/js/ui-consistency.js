(() => {
  const links = [...document.querySelectorAll('.nav-banner a[href^="#"]')];
  const sections = links
    .map(link => ({ link, section: document.querySelector(link.getAttribute('href')) }))
    .filter(item => item.section);

  const setActive = (activeLink) => {
    links.forEach(link => {
      const active = link === activeLink;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  links.forEach(link => {
    link.addEventListener('click', () => setActive(link));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const match = sections.find(item => item.section === visible.target);
      if (match) setActive(match.link);
    }, {
      rootMargin: '-18% 0px -62% 0px',
      threshold: [0.05, 0.2, 0.45]
    });
    sections.forEach(item => observer.observe(item.section));
  }

  setActive(links[0]);
})();
