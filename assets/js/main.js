/* SKEMA Consultoria Júnior — interações do site. Sem dependências. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let DATA = {};
  try { DATA = JSON.parse($('#page-data').textContent); } catch (e) { /* sem dados */ }
  const T = DATA.i18n || {};
  const fill = (str, map) => str.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? '');

  /* ---------------------------------------------------------- topo e menu -- */
  const hdr = $('[data-hdr]');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('is-stuck', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const toggle = $('.hdr__toggle');
  const nav = $('#nav');
  if (toggle && nav) {
    const set = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); toggle.focus(); }
    });
    matchMedia('(min-width: 1141px)').addEventListener('change', e => { if (e.matches) set(false); });
  }

  /* ------------------------------------------------ palavra que troca -- */
  const rot = $('[data-rot]');
  if (rot && !reduce) {
    const words = $$('.rot__w', rot);
    // a largura do bloco acompanha a palavra mais longa, para o título não pular
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      const cur = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-off');
      next.classList.remove('is-off');
      // força o ponto de partida embaixo antes de subir
      next.style.transition = 'none'; next.style.transform = 'translateY(110%)';
      next.offsetHeight; // reflow
      next.style.transition = ''; next.style.transform = '';
      next.classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-off'), 750);
    }, 2600);
  }

  /* ---------------------------------------------- entradas ao rolar -- */
  const revealTargets = $$('.head, .about__text, .stats, .svc__row, .step, .case, .diag__body, .people__group, .quote, .post, .reason, .spec__block, .faq__list');
  if ('IntersectionObserver' in window && !reduce) {
    revealTargets.forEach(el => el.classList.add('rv'));
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const sibs = el.parentElement ? [...el.parentElement.children].filter(c => c.classList.contains('rv')) : [];
        const idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx, 5) * 70}ms`;
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(el => io.observe(el));
  }

  /* --------------------------------------- manifesto acende no scroll -- */
  const man = $('[data-manifesto]');
  if (man) {
    const words = $$('.w', man);
    if (reduce) {
      words.forEach(w => w.classList.add('is-lit'));
    } else {
      let ticking = false;
      const update = () => {
        ticking = false;
        const r = man.getBoundingClientRect();
        const vh = innerHeight;
        // começa a acender quando o topo entra a 85% da tela e termina quando o fim passa de 45%
        const start = vh * 0.85, end = vh * 0.45;
        const p = (start - r.top) / ((start - end) + r.height);
        const lit = Math.round(Math.max(0, Math.min(1, p)) * words.length);
        words.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
      };
      addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
      addEventListener('resize', update);
      update();
    }
  }

  /* -------------------------------------------------- mapa da rede -- */
  const net = $('[data-net]');
  if (net) {
    const pins = $$('.map__pin', net);
    const items = $$('.ant', net);
    const arcs = $$('.map__arc', net);
    const select = id => {
      pins.forEach(p => p.classList.toggle('is-on', p.dataset.antenna === id));
      items.forEach(b => {
        const on = b.dataset.antenna === id;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      arcs.forEach(a => a.classList.toggle('is-on', a.dataset.arc === id));
    };
    pins.forEach(p => {
      p.addEventListener('click', () => select(p.dataset.antenna));
      p.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(p.dataset.antenna); }
      });
    });
    items.forEach(b => {
      b.addEventListener('click', () => select(b.dataset.antenna));
      b.addEventListener('mouseenter', () => select(b.dataset.antenna));
    });
    select('bh');

    // desenha os arcos quando o mapa aparece
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([en]) => {
        if (en.isIntersecting) { net.classList.add('is-in'); io.disconnect(); }
      }, { threshold: 0.25 });
      io.observe(net);
    } else net.classList.add('is-in');

    // hora local em cada antena
    const clocks = $$('[data-tz]', net);
    const tick = () => clocks.forEach(c => {
      try {
        c.textContent = new Intl.DateTimeFormat(DATA.lang || 'pt-BR', {
          hour: '2-digit', minute: '2-digit', hour12: false, timeZone: c.dataset.tz,
        }).format(new Date());
      } catch (e) { c.textContent = ''; }
    });
    tick();
    setInterval(tick, 30000);
  }

  /* ------------------------------------------------- mini-diagnóstico -- */
  const diag = $('[data-diag]');
  const out = $('[data-diag-result]');
  if (diag && out && DATA.diag) {
    const D = DATA.diag;
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const render = () => {
      const size = diag.elements.size.value;
      const ch = diag.elements.challenge.value;
      if (!size || !ch) return;
      const s = D.sizes[size], c = D.challenges[ch], svc = DATA.services[c.service];
      out.classList.remove('is-new'); out.offsetHeight; out.classList.add('is-new');
      out.innerHTML = `
        <p class="diag__start">${esc(D.start)}</p>
        <p class="diag__svc">${esc(svc.name)}</p>
        <p class="diag__out">${esc(svc.outcome)}</p>
        <p class="diag__note">${esc(s.note)}</p>
        <ul class="svc__gets" aria-label="${esc(D.gets)}">${svc.receives.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
        <div class="diag__actions">
          <button type="button" class="btn" data-diag-go>${esc(D.cta)}</button>
          <a class="link" href="${esc(svc.url)}">${esc(D.more)}</a>
        </div>`;
      $('[data-diag-go]', out).addEventListener('click', () => {
        prefill(fill(D.msg, { size: s.label, challenge: c.label, service: svc.name }));
      });
    };
    diag.addEventListener('change', render);
    diag.addEventListener('submit', e => e.preventDefault());
  }

  /* --------------------------------------------------------- formulário -- */
  const form = $('[data-form]');
  const status = $('[data-form-status]');

  function prefill(text) {
    if (!form) return;
    const ta = form.elements.desafio;
    ta.value = text + (ta.value && !ta.value.startsWith(text) ? '\n\n' + ta.value : '');
    $('#contato').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => form.elements.nome.focus({ preventScroll: true }), reduce ? 0 : 600);
  }

  // vindo de uma página de serviço: ?s=pesquisa
  if (form) {
    const sid = new URLSearchParams(location.search).get('s');
    if (sid && DATA.services && DATA.services[sid] && T.interest) {
      form.elements.desafio.value = fill(T.interest, { service: DATA.services[sid].name }) + '\n';
    }
  }

  if (form) {
    const fields = ['nome', 'empresa', 'contato', 'desafio'];
    const setStatus = (msg, bad) => { status.textContent = msg; status.classList.toggle('is-bad', !!bad); };

    fields.forEach(n => form.elements[n].addEventListener('input', e => {
      e.target.closest('.field').classList.remove('is-bad');
      e.target.removeAttribute('aria-invalid');
    }));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      let first = null;
      fields.forEach(n => {
        const el = form.elements[n];
        const bad = !el.value.trim();
        el.closest('.field').classList.toggle('is-bad', bad);
        if (bad) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
        if (bad && !first) first = el;
      });
      if (first) { setStatus(T.invalid, true); first.focus(); return; }

      const values = Object.fromEntries(fields.map(n => [n, form.elements[n].value.trim()]));
      const btn = form.querySelector('button[type="submit"]');

      if (DATA.endpoint) {
        btn.disabled = true;
        try {
          const res = await fetch(DATA.endpoint, {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...values, _subject: `${T.subject}: ${values.empresa}` }),
          });
          if (!res.ok) throw new Error(res.status);
          form.reset();
          setStatus(T.sent);
        } catch (err) {
          setStatus(T.error, true);
        } finally { btn.disabled = false; }
        return;
      }

      // sem endpoint: abre o e-mail do visitante com a mensagem pronta
      const body = fields.map((n, i) => `${T.labels[i]}: ${values[n]}`).join('\n');
      location.href = `mailto:${DATA.email}?subject=${encodeURIComponent(`${T.subject}: ${values.empresa}`)}&body=${encodeURIComponent(body)}`;
      setStatus(T.mail);
    });
  }
})();
