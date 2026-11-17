/* SKEMA Consultoria Júnior — interações do site. Sem dependências. */
(() => {
  'use strict';
  const root = document.documentElement;
  root.classList.add('js');

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  let DATA = {};
  try { DATA = JSON.parse($('#page-data').textContent); } catch (e) { /* sem dados */ }
  const T = DATA.i18n || {};
  const fill = (str, map) => str.replace(/\{(\w+)\}/g, (_, k) => map[k] ?? '');

  /* ------------------------------------------------------------- menu -- */
  const hdr = $('[data-hdr]');
  const toggle = $('.hdr__toggle');
  const nav = $('#nav');
  const menuOpen = () => !!toggle && toggle.getAttribute('aria-expanded') === 'true';
  if (toggle && nav) {
    const set = open => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.close : toggle.dataset.open);
      nav.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) hdr.classList.remove('is-hidden');
    };
    toggle.addEventListener('click', () => set(!menuOpen()));
    nav.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    addEventListener('keydown', e => {
      if (e.key === 'Escape' && menuOpen()) { set(false); toggle.focus(); }
    });
    matchMedia('(min-width: 1141px)').addEventListener('change', e => { if (e.matches) set(false); });
  }
  let progress = null;
  if (hdr) {
    progress = document.createElement('span');
    progress.className = 'hdr__progress';
    progress.setAttribute('aria-hidden', 'true');
    hdr.append(progress);
  }

  /* ------------------------------------------------ palavra que troca -- */
  // (com movimento reduzido, o CSS troca o deslize por um fade)
  const rot = $('[data-rot]');
  if (rot) {
    const words = $$('.rot__w', rot);
    let i = 0;
    setTimeout(() => setInterval(() => {
      if (document.hidden) return;
      const cur = words[i];
      i = (i + 1) % words.length;
      const next = words[i];
      cur.classList.remove('is-on'); cur.classList.add('is-off');
      next.classList.remove('is-off');
      next.style.transition = 'none'; next.style.transform = 'translateY(110%)';
      next.offsetHeight; // reflow: a próxima palavra parte de baixo
      next.style.transition = ''; next.style.transform = '';
      next.classList.add('is-on');
      setTimeout(() => cur.classList.remove('is-off'), 750);
    }, 2600), 1200); // espera a entrada do título terminar
  }

  /* -------------------------- títulos: palavras sobem por trás da máscara -- */
  const splitTargets = $$('.head__title, .about__text, .contact__title, .band__title, .phero__title')
    .filter(el => el.childElementCount === 0 && el.textContent.trim());
  splitTargets.forEach(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    el.setAttribute('aria-label', text);
    const inner = document.createElement('span');
    inner.setAttribute('aria-hidden', 'true');
    inner.innerHTML = text.split(' ').map((w, i) => `<span class="mw"><span style="--i:${i}">${esc(w)}</span></span>`).join(' ');
    el.textContent = '';
    el.append(inner);
    el.classList.add('is-split');
  });

  /* ----------------------------------------------- entradas ao rolar -- */
  const fadeTargets = $$('.head__lead, .about__photo--slot, .svc__row, .case, .diag__body, .people__group, .quote, .post, .reason, .spec__block, .faq__list, .net__side');
  fadeTargets.forEach(el => el.classList.add('rv'));
  const ioTargets = [...splitTargets, ...fadeTargets, ...$$('.photo, .stats, .net')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        if (el.classList.contains('rv') && el.parentElement) {
          const sibs = [...el.parentElement.children].filter(c => c.classList.contains('rv'));
          el.style.transitionDelay = `${Math.min(Math.max(0, sibs.indexOf(el)), 5) * 80}ms`;
        }
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    ioTargets.forEach(el => io.observe(el));
  } else {
    ioTargets.forEach(el => el.classList.add('is-in'));
  }

  /* ------------------------- efeitos ligados à rolagem (um laço só) -- */
  const photos = $$('[data-photo] img');
  const stepLists = $$('.steps');
  const man = $('[data-manifesto]');
  const manWords = man ? $$('.w', man) : [];
  let lastY = scrollY;
  let ticking = false;

  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight;

    // topo: some ao descer, volta ao subir; barra de progresso da leitura
    if (hdr) {
      hdr.classList.toggle('is-stuck', y > 8);
      if (Math.abs(y - lastY) > 4) {
        const hide = y > lastY && y > 360 && !menuOpen() && !hdr.contains(document.activeElement);
        hdr.classList.toggle('is-hidden', hide);
      }
      const max = root.scrollHeight - vh;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    }
    lastY = y;

    // foto da equipe: a imagem anda mais devagar que a página
    if (!reduce) photos.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
      img.style.transform = `translate3d(0, ${(p * -6).toFixed(2)}%, 0)`;
    });

    // método: a linha avança passo a passo
    stepLists.forEach(list => {
      const items = [...list.children];
      const r = list.getBoundingClientRect();
      const start = vh * 0.85, end = vh * 0.4;
      const p = clamp((start - r.top) / (start - end), 0, 1);
      items.forEach((s, i) => {
        const v = clamp(p * items.length - i, 0, 1);
        s.style.setProperty('--s', v.toFixed(3));
        s.classList.toggle('is-on', v > 0.4);
      });
    });

    // manifesto: as palavras acendem conforme a rolagem
    if (man) {
      const r = man.getBoundingClientRect();
      const start = vh * 0.85, end = vh * 0.45;
      const lit = Math.round(clamp((start - r.top) / ((start - end) + r.height), 0, 1) * manWords.length);
      manWords.forEach((w, i) => w.classList.toggle('is-lit', i < lit));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame);
  frame();

  /* -------------------------------- faixa de texto em movimento -- */
  // O movimento base é uma animação CSS. Aqui só mudamos a velocidade dela:
  // rolar acelera a faixa, e rolar para cima inverte o sentido.
  const mq = $('[data-marquee]');
  const anim = mq && !reduce && $('.marquee__track', mq).getAnimations ? $('.marquee__track', mq).getAnimations()[0] : null;
  if (anim) {
    let rate = 1, target = 1, raf = 0, prevY = scrollY;
    const ease = () => {
      const dir = target < 0 ? -1 : 1;
      target += (dir - target) * 0.06;              // o impulso se desfaz aos poucos
      rate += (target - rate) * 0.12;
      anim.playbackRate = rate;
      if (Math.abs(rate - dir) < 0.01 && Math.abs(target - dir) < 0.01) { anim.playbackRate = dir; raf = 0; return; }
      raf = requestAnimationFrame(ease);
    };
    addEventListener('scroll', () => {
      const dy = scrollY - prevY;
      prevY = scrollY;
      if (!dy) return;
      target = (dy > 0 ? 1 : -1) * (1 + Math.min(Math.abs(dy), 90) / 9);
      if (!raf) raf = requestAnimationFrame(ease);
    }, { passive: true });
  }

  /* ------------------------------------- luz sobre os cards de case -- */
  if (finePointer) $$('.case__tile').forEach(tile => {
    tile.addEventListener('pointermove', e => {
      const r = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - r.left}px`);
      tile.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------------------------------------- botões magnéticos -- */
  if (finePointer && !reduce) $$('.btn:not(.btn--sm), .wa').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      b.style.transform = `translate(${(dx * 12).toFixed(1)}px, ${(dy * 10).toFixed(1)}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

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
  const form = $('[data-form]');
  const status = $('[data-form-status]');

  function prefill(text) {
    if (!form) return;
    const ta = form.elements.desafio;
    ta.value = text + (ta.value && !ta.value.startsWith(text) ? '\n\n' + ta.value : '');
    $('#contato').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => form.elements.nome.focus({ preventScroll: true }), reduce ? 0 : 700);
  }

  const diag = $('[data-diag]');
  const out = $('[data-diag-result]');
  if (diag && out && DATA.diag) {
    const D = DATA.diag;
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
  if (form) {
    // vindo de uma página de serviço: ?s=pesquisa
    const sid = new URLSearchParams(location.search).get('s');
    if (sid && DATA.services && DATA.services[sid] && T.interest) {
      form.elements.desafio.value = fill(T.interest, { service: DATA.services[sid].name }) + '\n';
    }

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
