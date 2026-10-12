(() => {
  const root = document.body;
  const panel = document.createElement('aside');
  panel.className = 'quick-nav';
  panel.id = 'quick-nav';
  panel.setAttribute('aria-label', 'Quick navigation');
  panel.hidden = true;
  panel.innerHTML = `<p>Quick access</p><a href="index.html">Home</a><a href="about.html">About</a><a href="research.html">Research</a><a href="index.html#projects">Projects</a><a href="index.html#research-outputs">Research outputs</a><a href="network.html">Network</a><a href="contact.html">Consulting & contact</a>`;
  const button = document.createElement('button');
  button.className = 'quick-nav-toggle';
  button.type = 'button';
  button.setAttribute('aria-controls', 'quick-nav');
  button.setAttribute('aria-expanded', 'false');
  button.textContent = 'Quick access';
  button.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Close menu' : 'Quick access';
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) button.click();
  });
  root.append(button, panel);

  const list = document.querySelector('#outputs-list');
  if (!list) return;
  const escape = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
  fetch('https://api.openalex.org/works?filter=author.id:A5061967109&sort=publication_date:desc&per-page=6')
    .then((response) => response.ok ? response.json() : Promise.reject())
    .then(({ results }) => {
      list.innerHTML = results.map((work) => {
        const source = work.primary_location?.source?.display_name || 'Research output';
        const year = work.publication_year || '';
        const link = work.doi || work.id;
        return `<article><span>${escape(source)} · ${escape(year)}</span><h3><a href="${escape(link)}" target="_blank" rel="noreferrer">${escape(work.title)}</a></h3><p>${escape(work.authorships?.map((author) => author.author.display_name).join(', '))}</p></article>`;
      }).join('');
    })
    .catch(() => { list.innerHTML = '<p>Recent outputs are temporarily unavailable. Please visit the University of Auckland publications page.</p>'; });
})();
