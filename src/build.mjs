// =============================================================================
//  Gerador do site — SKEMA Consultoria Júnior
//  Uso:  node src/build.mjs            rascunho (mostra itens ilustrativos)
//        node src/build.mjs --final    versão para publicar (esconde ilustrativos)
//  Sem dependências. Gera as páginas em PT (raiz), EN (/en) e FR (/fr).
// =============================================================================
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as C from './content.mjs';
import { icon, mark, skyline, worldMap } from './art.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FINAL = process.argv.includes('--final');
const LANGS = ['pt', 'en', 'fr'];
const HTML_LANG = { pt: 'pt-BR', en: 'en', fr: 'fr' };
const live = arr => arr.filter(x => !(FINAL && x.ilustrativo));
// versão dos arquivos: muda quando o conteúdo muda, para o navegador não usar cache antigo
const ver = p => createHash('md5').update(readFileSync(path.join(ROOT, 'assets', p))).digest('hex').slice(0, 8);
const V = { css: ver('css/style.css'), js: ver('js/main.js') };

const cases = live(C.cases), testimonials = live(C.testimonials), articles = live(C.articles),
  team = live(C.team), selection = live(C.join.selection), stats = live(C.stats);

// ------------------------------------------------------------------ rotas ----
const routes = {
  home: { pt: 'index.html', en: 'en/index.html', fr: 'fr/index.html' },
  join: { pt: 'faca-parte.html', en: 'en/join-us.html', fr: 'fr/nous-rejoindre.html' },
};
const SVC_DIR = { pt: 'servicos', en: 'en/services', fr: 'fr/services' };
for (const s of C.services) {
  routes['svc:' + s.id] = Object.fromEntries(LANGS.map(l => [l, `${SVC_DIR[l]}/${s.slug[l]}.html`]));
}

// --------------------------------------------------------------- contexto ----
function context(lang, key) {
  const file = routes[key][lang];
  const dir = path.posix.dirname(file);
  const rel = to => path.posix.relative(dir, to) || path.posix.basename(to);
  const t = (a, b, c) => (typeof a === 'object' ? a[lang] : { pt: a, en: b, fr: c }[lang]);
  const href = (k, hash = '', query = '') => {
    if (k === key && hash && !query) return hash;
    return rel(routes[k][lang]) + query + hash;
  };
  const tag = (x, pt = 'Ilustrativo', en = 'Illustrative', fr = 'Illustratif') =>
    x && x.ilustrativo ? `<span class="tag-draft">${t(pt, en, fr)}</span>` : '';
  return { lang, key, file, rel, t, href, tag, asset: p => rel('assets/' + p) };
}

const svcById = id => C.services.find(s => s.id === id);
const initials = name => name.split(' ').map(w => w[0]).slice(0, 2).join('');
const wa = text => `https://wa.me/${C.site.whatsapp}?text=${encodeURIComponent(text)}`;

// ------------------------------------------------------------ componentes ----
function header(x) {
  const { t, href, lang, key } = x;
  const items = [
    [href('home', '#servicos'), t('Serviços', 'Services', 'Services')],
    cases.length && [href('home', '#cases'), t('Cases', 'Case studies', 'Réalisations')],
    [href('home', '#sobre'), t('Sobre', 'About', 'À propos')],
    [href('home', '#rede'), t('Rede SKEMA', 'SKEMA network', 'Réseau SKEMA')],
    articles.length && [href('home', '#conteudo'), t('Conteúdo', 'Insights', 'Publications')],
    [href('join'), t('Faça parte', 'Join us', 'Nous rejoindre'), key === 'join'],
  ].filter(Boolean);
  return `
<a class="skip" href="#principal">${t('Pular para o conteúdo', 'Skip to content', 'Aller au contenu')}</a>
${FINAL ? '' : `<p class="draftbar">${t(
    'Versão de rascunho. Os itens com a etiqueta “Ilustrativo” aguardam conteúdo real e não entram na versão final.',
    'Draft version. Items tagged “Illustrative” are waiting for real content and are left out of the final build.',
    'Version brouillon. Les éléments marqués « Illustratif » attendent un contenu réel et sont exclus de la version finale.')}</p>`}
<header class="hdr" data-hdr>
  <div class="wrap hdr__in">
    <a class="brand" href="${x.rel(routes.home[lang])}" aria-label="${C.site.name}">
      ${mark}<span class="brand__full">SKEMA Consultoria Júnior</span><span class="brand__short" aria-hidden="true">SKJR</span>
    </a>
    <nav class="nav" id="nav" aria-label="${t('Principal', 'Main', 'Principale')}">
      <ul class="nav__list">
        ${items.map(([h, label, cur]) => `<li><a href="${h}"${cur ? ' aria-current="page"' : ''}>${label}</a></li>`).join('\n        ')}
      </ul>
      <ul class="langs" aria-label="${t('Idioma', 'Language', 'Langue')}">
        ${LANGS.map(l => `<li><a href="${x.rel(routes[key][l])}" hreflang="${HTML_LANG[l]}" lang="${HTML_LANG[l]}"${l === lang ? ' aria-current="true"' : ''}>${l.toUpperCase()}</a></li>`).join('')}
      </ul>
    </nav>
    <a class="btn btn--sm hdr__cta" href="${href('home', '#contato')}">${t('Fale com a gente', 'Talk to us', 'Parlons-en')}</a>
    <button class="hdr__toggle" type="button" aria-expanded="false" aria-controls="nav"
      data-open="${t('Abrir menu', 'Open menu', 'Ouvrir le menu')}" data-close="${t('Fechar menu', 'Close menu', 'Fermer le menu')}"
      aria-label="${t('Abrir menu', 'Open menu', 'Ouvrir le menu')}">${icon.menu}${icon.close}</button>
  </div>
</header>`;
}

function footer(x) {
  const { t, href } = x;
  return `
<footer class="ftr">
  <div class="wrap ftr__in">
    <div class="ftr__brand">
      <p class="ftr__name">${mark} ${C.site.name}</p>
      <p>${t(
        'Antena brasileira da SKEMA Conseil. Empresa júnior da SKEMA Business School em Belo Horizonte.',
        'Brazilian branch of SKEMA Conseil. The junior enterprise of SKEMA Business School in Belo Horizonte.',
        'Antenne brésilienne de SKEMA Conseil. La Junior-Entreprise de SKEMA Business School à Belo Horizonte.')}</p>
    </div>
    <nav aria-label="${t('Rodapé', 'Footer', 'Pied de page')}">
      <ul class="ftr__list">
        ${C.services.map(s => `<li><a href="${href('svc:' + s.id)}">${t(s.name)}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <ul class="ftr__list">
      <li><a href="${href('home', '#contato')}">${t('Solicitar diagnóstico', 'Request a diagnosis', 'Demander un diagnostic')}</a></li>
      <li><a href="${href('join')}">${t('Faça parte', 'Join us', 'Nous rejoindre')}</a></li>
      <li><a href="mailto:${C.site.email}">${C.site.email}</a></li>
      <li><a href="${C.site.instagram}" rel="noopener">Instagram</a></li>
      ${C.site.linkedin ? `<li><a href="${C.site.linkedin}" rel="noopener">LinkedIn</a></li>` : ''}
    </ul>
  </div>
  <div class="wrap ftr__base">
    <p>© ${C.site.year} ${C.site.name}</p>
    <p>Belo Horizonte, Minas Gerais</p>
  </div>
</footer>
<a class="wa" href="${wa(t('Olá! Quero falar sobre um projeto com a SKJR.', 'Hello! I would like to talk about a project with SKJR.', 'Bonjour ! Je souhaite parler d’un projet avec SKJR.'))}" rel="noopener" target="_blank">
  ${icon.whatsapp}<span>WhatsApp</span>
</a>`;
}

function methodList(x) {
  const { t } = x;
  return `<ol class="steps">
    ${C.steps.map((s, i) => `<li class="step">
      <span class="step__n" aria-hidden="true">${i + 1}</span>
      <h3 class="step__title">${t(s.title)}</h3>
      <p class="step__text">${t(s.text)}</p>
      ${s.mark ? `<p class="step__mark"><strong>${t(s.mark)}</strong> ${t(s.markLabel)}</p>` : ''}
    </li>`).join('\n    ')}
  </ol>`;
}

function caseCard(x, c) {
  const { t, href, tag } = x;
  const s = svcById(c.service);
  return `<li class="case${c.photo ? ' case--photo' : ''}">
      <div class="case__tile">
        ${c.photo ? `<img class="case__img" src="${x.rel(c.photo)}" alt="" loading="lazy">` : ''}
        <div class="case__seal">
          <p class="case__metric">${t(c.metric)}</p>
          <p class="case__unit">${t(c.unit)}</p>
        </div>
        ${tag(c)}
      </div>
      <h3 class="case__title">${t(c.title)}</h3>
      <p class="case__meta">${c.logo ? `<img class="case__logo" src="${x.rel(c.logo)}" alt="" loading="lazy">` : ''}<span>${t(c.client)}</span><a href="${href('svc:' + s.id)}">${t(s.name)}</a></p>
    </li>`;
}

function ctaBand(x, query = '') {
  const { t, href } = x;
  return `
<section class="band">
  <div class="wrap band__in">
    <h2 class="band__title">${t('Qual o seu desafio?', 'What is your challenge?', 'Quel est votre défi ?')}</h2>
    <div>
      <p>${t('Respondemos em até 24h e enviamos a proposta em até 48h depois do diagnóstico.',
        'We reply within 24h and send the proposal within 48h of the diagnosis.',
        'Nous répondons sous 24 h et envoyons la proposition sous 48 h après le diagnostic.')}</p>
      <a class="btn btn--inv" href="${href('home', '#contato', query)}">${t('Solicitar diagnóstico', 'Request a diagnosis', 'Demander un diagnostic')}</a>
    </div>
  </div>
</section>`;
}

// ------------------------------------------------------------------- home ----
function home(x) {
  const { t, href, tag, lang } = x;
  const words = [t(C.pillars.research), t(C.pillars.strategy), t(C.pillars.marketing)];
  const cities = C.antennas.map(a => t(a.city));
  const manifesto = t(C.manifesto);

  return `
<main id="principal">

<section class="hero">
  <div class="wrap hero__in">
    <p class="hero__seal">${t('A única empresa júnior internacional do Brasil', 'Brazil’s only international junior enterprise', 'La seule Junior-Entreprise internationale du Brésil')}</p>
    <h1 class="hero__title">
      <span class="sr-only">${t(
        'Pesquisa, estratégia e marketing que geram resultado para o seu negócio.',
        'Research, strategy and marketing that deliver results for your business.',
        'Études, stratégie et marketing au service des résultats de votre entreprise.')}</span>
      <span aria-hidden="true">
        <span class="rot" data-rot>${words.map((w, i) => `<span class="rot__w${i ? '' : ' is-on'}">${w}</span>`).join('')}</span>
        <span class="hero__rest">${t('que gera resultado<br>para o seu negócio.', 'that delivers results<br>for your business.', 'au service des résultats<br>de votre entreprise.')}</span>
      </span>
    </h1>
    <div class="hero__side">
      <p class="hero__sub">${t(
        'Padrão global, raízes mineiras. Somos estudantes da SKEMA Business School em Belo Horizonte, com o método de uma rede presente em quatro continentes.',
        'Global standards, roots in Minas Gerais. We are SKEMA Business School students in Belo Horizonte, working with the method of a network present on four continents.',
        'Standards mondiaux, racines du Minas Gerais. Nous sommes des étudiants de SKEMA Business School à Belo Horizonte, avec la méthode d’un réseau présent sur quatre continents.')}</p>
      <div class="hero__actions">
        <a class="btn" href="#contato">${t('Solicitar diagnóstico', 'Request a diagnosis', 'Demander un diagnostic')}</a>
        ${cases.length
          ? `<a class="btn btn--ghost" href="#cases">${t('Ver cases', 'See case studies', 'Voir les réalisations')}</a>`
          : `<a class="btn btn--ghost" href="#servicos">${t('Ver serviços', 'See services', 'Voir les services')}</a>`}
      </div>
    </div>
  </div>
  <div class="panel" tabindex="-1">
    <div class="panel__in">${skyline(t(
      'Desenho em linha: a Igrejinha da Pampulha e a Praça da Liberdade, em Belo Horizonte, ao lado de Lille, Paris, Nice, Raleigh e Dubai.',
      'Line drawing: the Pampulha church and Praça da Liberdade in Belo Horizonte, next to Lille, Paris, Nice, Raleigh and Dubai.',
      'Dessin au trait : l’église de Pampulha et la Praça da Liberdade à Belo Horizonte, aux côtés de Lille, Paris, Nice, Raleigh et Dubaï.'), cities)}</div>
  </div>
</section>

<section class="strip" aria-label="${t('Rede e clientes', 'Network and clients', 'Réseau et clients')}">
  <div class="wrap strip__in">
    <div class="strip__group">
      <p class="strip__label">${t('Fazemos parte de', 'We are part of', 'Nous faisons partie de')}</p>
      <ul class="strip__list"><li>SKEMA Business School</li><li>SKEMA Conseil</li></ul>
    </div>
    ${C.clients.length ? `<div class="strip__group">
      <p class="strip__label">${t('Quem já contratou', 'Who has hired us', 'Ils nous ont fait confiance')}</p>
      <ul class="strip__list strip__list--logos">${C.clients.map(c => `<li><img src="${x.rel(c.logo)}" alt="${c.name}" loading="lazy"></li>`).join('')}</ul>
    </div>` : FINAL ? '' : `<div class="strip__group">
      <p class="strip__label">${t('Quem já contratou', 'Who has hired us', 'Ils nous ont fait confiance')} <span class="tag-draft">${t('Ilustrativo', 'Illustrative', 'Illustratif')}</span></p>
      <ul class="strip__list strip__list--slots">${[1, 2, 3, 4].map(() => `<li>${t('Logo do cliente', 'Client logo', 'Logo du client')}</li>`).join('')}</ul>
    </div>`}
  </div>
</section>

<section class="sec about" id="sobre">
  <div class="wrap">
    <h2 class="about__text">${t(
      'Somos a antena brasileira da SKEMA Conseil, empresa júnior francesa fundada em 1969. Estudantes da SKEMA Business School, orientados por professores, resolvendo problemas reais de empresas mineiras.',
      'We are the Brazilian branch of SKEMA Conseil, a French junior enterprise founded in 1969. SKEMA Business School students, mentored by faculty, solving real problems for companies in Minas Gerais.',
      'Nous sommes l’antenne brésilienne de SKEMA Conseil, Junior-Entreprise française fondée en 1969. Des étudiants de SKEMA Business School, encadrés par leurs professeurs, au service des entreprises du Minas Gerais.')}</h2>
    ${C.teamPhoto
      ? `<figure class="about__photo"><img src="${x.rel(C.teamPhoto)}" alt="${t('Equipe da SKJR em reunião de projeto', 'The SKJR team in a project meeting', 'L’équipe SKJR en réunion de projet')}" loading="lazy"></figure>`
      : FINAL ? '' : `<figure class="about__photo about__photo--slot"><figcaption>${t(
        'Foto real da equipe em reunião ou com um cliente',
        'A real photo of the team in a meeting or with a client',
        'Une vraie photo de l’équipe en réunion ou avec un client')} <span class="tag-draft">${t('Ilustrativo', 'Illustrative', 'Illustratif')}</span></figcaption></figure>`}
    <dl class="stats" style="--n:${stats.length}">
      ${stats.map(s => `<div class="stat"><dt class="stat__label">${t(s.label)} ${tag(s)}</dt><dd class="stat__value">${t(s.value)}</dd></div>`).join('\n      ')}
    </dl>
  </div>
</section>

<section class="sec sec--white" id="servicos">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Cinco serviços, cada um com um resultado esperado', 'Five services, each with an expected result', 'Cinq services, chacun avec un résultat attendu')}</h2>
      <p class="head__lead">${t(
        'Todo projeto termina em algo que você usa na segunda-feira: um relatório, um plano, um painel.',
        'Every project ends in something you can use on Monday: a report, a plan, a dashboard.',
        'Chaque projet aboutit à quelque chose d’utilisable dès lundi : un rapport, un plan, un tableau de bord.')}</p>
    </div>
    <div class="svc">
      <div class="svc__cols" aria-hidden="true"><span></span><span>${t('Serviço', 'Service', 'Service')}</span><span>${t('O que você recebe', 'What you get', 'Ce que vous recevez')}</span><span></span></div>
      ${C.services.map(s => `<article class="svc__row">
        <p class="svc__pillar">${t(C.pillars[s.pillar])}</p>
        <div class="svc__main">
          <h3 class="svc__name"><a href="${href('svc:' + s.id)}">${t(s.name)}</a></h3>
          <p class="svc__outcome">${t(s.outcome)}</p>
        </div>
        <ul class="svc__gets" aria-label="${t('O que você recebe', 'What you get', 'Ce que vous recevez')}">
          ${s.receives.map(r => `<li>${t(r)}</li>`).join('')}
        </ul>
        <span class="svc__go">${icon.arrow}</span>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec" id="metodo">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Quatro passos, do primeiro contato à entrega', 'Four steps, from first contact to delivery', 'Quatre étapes, du premier contact à la livraison')}</h2>
      <p class="head__lead">${t(
        'O método é o mesmo da SKEMA Conseil, com prazo definido para as duas primeiras etapas.',
        'The method is the same as SKEMA Conseil’s, with set deadlines for the first two steps.',
        'La méthode est celle de SKEMA Conseil, avec des délais fixés pour les deux premières étapes.')}</p>
    </div>
    ${methodList(x)}
  </div>
</section>

${cases.length ? `<section class="sec sec--white" id="cases">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Resultado primeiro, história depois', 'Results first, story second', 'Le résultat d’abord, l’histoire ensuite')}</h2>
      <p class="head__lead">${t(
        'Cada case começa pelo número que mudou no negócio do cliente.',
        'Each case starts with the number that changed in the client’s business.',
        'Chaque réalisation commence par le chiffre qui a changé chez le client.')}</p>
    </div>
    <ul class="cases">
    ${cases.map(c => caseCard(x, c)).join('\n    ')}
    </ul>
  </div>
</section>` : ''}

<section class="sec" id="diagnostico">
  <div class="wrap diag">
    <div class="diag__intro">
      <h2 class="head__title">${t('Duas perguntas até o serviço certo', 'Two questions to the right service', 'Deux questions pour trouver le bon service')}</h2>
      <p class="head__lead">${t(
        'Responda e veja por onde começaríamos no seu caso.',
        'Answer them and see where we would start in your case.',
        'Répondez et voyez par où nous commencerions dans votre cas.')}</p>
    </div>
    <form class="diag__body" data-diag>
      <fieldset class="diag__q">
        <legend><span aria-hidden="true">1</span> ${t('Qual o porte da sua empresa?', 'How big is your company?', 'Quelle est la taille de votre entreprise ?')}</legend>
        <div class="chips">
          ${C.diag.sizes.map(s => `<label class="chip"><input type="radio" name="size" value="${s.id}"><span>${t(s.label)}</span></label>`).join('')}
        </div>
      </fieldset>
      <fieldset class="diag__q">
        <legend><span aria-hidden="true">2</span> ${t('Qual o seu maior desafio hoje?', 'What is your biggest challenge today?', 'Quel est votre plus grand défi aujourd’hui ?')}</legend>
        <div class="chips">
          ${C.diag.challenges.map(s => `<label class="chip"><input type="radio" name="challenge" value="${s.id}"><span>${t(s.label)}</span></label>`).join('')}
        </div>
      </fieldset>
      <div class="diag__result" data-diag-result aria-live="polite">
        <p class="diag__empty">${t('Escolha uma opção em cada pergunta.', 'Pick one option for each question.', 'Choisissez une option pour chaque question.')}</p>
      </div>
    </form>
  </div>
</section>

<section class="rede" id="rede">
  <div class="wrap">
    <h2 class="sr-only">${t('Rede SKEMA', 'SKEMA network', 'Réseau SKEMA')}</h2>
    <p class="manifesto" data-manifesto>
      <span class="sr-only">${manifesto}</span>
      <span aria-hidden="true">${manifesto.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')}</span>
    </p>
    <div class="net" data-net>
      <div class="net__map">${worldMap(C.antennas, lang, t('Mapa das seis antenas da SKEMA Conseil', 'Map of the six SKEMA Conseil branches', 'Carte des six antennes de SKEMA Conseil'))}</div>
      <div class="net__side">
        <h3 class="net__title">${t('As seis antenas da SKEMA Conseil', 'The six SKEMA Conseil branches', 'Les six antennes de SKEMA Conseil')}</h3>
        <ul class="net__list">
          ${C.antennas.map(a => `<li><button type="button" class="ant${a.home ? ' is-on' : ''}" data-antenna="${a.id}" aria-pressed="${a.home ? 'true' : 'false'}">
            <span class="ant__city">${t(a.city)}</span>
            <span class="ant__place">${t(a.country)}, ${t(a.continent)}${a.home ? ` <em>${t('nossa base', 'our base', 'notre base')}</em>` : ''}</span>
            <span class="ant__time" data-tz="${a.tz}" title="${t('Hora local', 'Local time', 'Heure locale')}"></span>
          </button></li>`).join('\n          ')}
        </ul>
        <p class="net__note">${t('Hora local em cada antena, agora.', 'Local time at each branch, right now.', 'Heure locale dans chaque antenne, en ce moment.')}</p>
      </div>
    </div>
  </div>
</section>

<section class="sec sec--white" id="equipe">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Quem faz o seu projeto', 'Who works on your project', 'Qui réalise votre projet')}</h2>
      <p class="head__lead">${t(
        'Cada projeto tem uma equipe de estudantes da SKEMA Business School e a mentoria de um professor.',
        'Every project has a team of SKEMA Business School students and a faculty mentor.',
        'Chaque projet réunit une équipe d’étudiants de SKEMA Business School et un professeur mentor.')}</p>
    </div>
    <div class="people">
      <div class="people__group">
        <h3 class="people__h">${t('Mentoria docente', 'Faculty mentors', 'Mentorat académique')}</h3>
        <ul class="people__list">
          ${C.mentors.map(m => `<li class="person">
            ${m.photo ? `<img class="person__ph" src="${x.rel(m.photo)}" alt="" loading="lazy">` : `<div class="person__ph" aria-hidden="true">${initials(m.name)}</div>`}
            <p class="person__name">${m.name}</p>
            <p class="person__role">${t('Docente da SKEMA Business School', 'SKEMA Business School faculty', 'Corps professoral de SKEMA Business School')}</p>
          </li>`).join('\n          ')}
        </ul>
      </div>
      <div class="people__group">
        <h3 class="people__h">${t('Equipe', 'Team', 'Équipe')}</h3>
        <p class="people__areas">${t('Sete áreas trabalham juntas em cada entrega:', 'Seven areas work together on every delivery:', 'Sept pôles travaillent ensemble sur chaque livraison :')} ${t(C.areas)}.</p>
        ${team.length ? `<ul class="people__list">
          ${team.map(m => `<li class="person">
            ${m.photo ? `<img class="person__ph" src="${x.rel(m.photo)}" alt="" loading="lazy">` : `<div class="person__ph person__ph--slot" aria-hidden="true">${t('foto', 'photo', 'photo')}</div>`}
            <p class="person__name">${t(m.name)} ${tag(m)}</p>
            <p class="person__role">${t(m.role)}</p>
          </li>`).join('\n          ')}
        </ul>` : ''}
      </div>
    </div>
  </div>
</section>

${testimonials.length ? `<section class="sec" id="depoimentos">
  <div class="wrap">
    <div class="head"><h2 class="head__title">${t('O que os clientes dizem', 'What clients say', 'Ce que disent nos clients')}</h2></div>
    <ul class="quotes">
      ${testimonials.map(q => `<li class="quote">
        <blockquote><p>${t(q.quote)}</p></blockquote>
        <div class="quote__by">
          ${q.photo || q.logo
            ? `<img class="quote__img${q.logo && !q.photo ? ' quote__img--logo' : ''}" src="${x.rel(q.photo || q.logo)}" alt="" loading="lazy">`
            : FINAL ? '' : `<span class="quote__img quote__img--slot" aria-hidden="true">${t('foto ou logo', 'photo or logo', 'photo ou logo')}</span>`}
          <p><strong>${t(q.name)}</strong><span>${t(q.role)}</span></p>
          ${tag(q)}
        </div>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>` : ''}

${articles.length ? `<section class="sec${testimonials.length ? ' sec--white' : ''}" id="conteudo">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Estudos e materiais', 'Studies and resources', 'Études et ressources')}</h2>
      <p class="head__lead">${t(
        'Os estudos do Skope e o que aprendemos nos projetos, abertos para quem empreende em Minas.',
        'Skope studies and what we learn in our projects, open to anyone doing business in Minas Gerais.',
        'Les études Skope et ce que nous apprenons dans nos projets, ouverts à ceux qui entreprennent au Minas Gerais.')}</p>
    </div>
    <ul class="posts">
      ${articles.map(a => `<li class="post">
        <p class="post__kind">${t(a.kind)} ${tag(a)}</p>
        <h3 class="post__title">${a.href ? `<a href="${a.href}">${t(a.title)}</a>` : t(a.title)}</h3>
        ${a.href ? '' : `<p class="post__soon">${t('Em breve', 'Coming soon', 'Bientôt disponible')}</p>`}
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>` : ''}

<section class="next" aria-labelledby="proximo">
  <div class="wrap next__head">
    <h2 class="head__title" id="proximo">${t('Qual é o seu próximo passo?', 'What is your next step?', 'Quelle est votre prochaine étape ?')}</h2>
  </div>
  <div class="doors">
  <a class="door door--hire" href="#contato">
    <span class="door__title">${t('Quero contratar', 'I want to hire SKJR', 'Je veux faire appel à SKJR')}</span>
    <span class="door__text">${t('Para empresas: resposta em até 24h e proposta em até 48h.', 'For companies: a reply within 24h and a proposal within 48h.', 'Pour les entreprises : réponse sous 24 h et proposition sous 48 h.')}</span>
    <span class="door__go">${icon.arrow}</span>
  </a>
  <a class="door door--join" href="${href('join')}">
    <span class="door__title">${t('Quero fazer parte da SKJR', 'I want to join SKJR', 'Je veux rejoindre SKJR')}</span>
    <span class="door__text">${t('Para estudantes da SKEMA em Belo Horizonte: veja como funciona o processo seletivo.', 'For SKEMA students in Belo Horizonte: see how the selection process works.', 'Pour les étudiants de SKEMA à Belo Horizonte : découvrez le processus de recrutement.')}</span>
    <span class="door__go">${icon.arrow}</span>
  </a>
  </div>
</section>

<section class="sec contact" id="contato">
  <div class="wrap contact__in">
    <div class="contact__intro">
      <h2 class="contact__title">${t('Qual o seu desafio?', 'What is your challenge?', 'Quel est votre défi ?')}</h2>
      <p class="head__lead">${t(
        'Conte em poucas linhas. Respondemos em até 24h e enviamos a proposta em até 48h depois do diagnóstico.',
        'Tell us in a few lines. We reply within 24h and send the proposal within 48h of the diagnosis.',
        'Racontez-le en quelques lignes. Nous répondons sous 24 h et envoyons la proposition sous 48 h après le diagnostic.')}</p>
      <ul class="contact__ways">
        <li><a href="${wa(t('Olá! Quero falar sobre um projeto com a SKJR.', 'Hello! I would like to talk about a project with SKJR.', 'Bonjour ! Je souhaite parler d’un projet avec SKJR.'))}" rel="noopener" target="_blank">${icon.whatsapp}<span>WhatsApp</span></a></li>
        <li><a href="mailto:${C.site.email}">${icon.mail}<span>${C.site.email}</span></a></li>
        <li><a href="${C.site.instagram}" rel="noopener" target="_blank">${icon.instagram}<span>${C.site.instagramHandle}</span></a></li>
      </ul>
      ${!FINAL && C.site.contatosProvisorios ? `<p><span class="tag-draft">${t('Contatos provisórios', 'Placeholder contacts', 'Coordonnées provisoires')}</span></p>` : ''}
    </div>
    <form class="form" data-form novalidate>
      <div class="field"><label for="f-nome">${t('Nome', 'Name', 'Nom')}</label><input id="f-nome" name="nome" type="text" autocomplete="name" required></div>
      <div class="field"><label for="f-empresa">${t('Empresa', 'Company', 'Entreprise')}</label><input id="f-empresa" name="empresa" type="text" autocomplete="organization" required></div>
      <div class="field"><label for="f-contato">${t('E-mail ou WhatsApp', 'Email or WhatsApp', 'E-mail ou WhatsApp')}</label><input id="f-contato" name="contato" type="text" autocomplete="email" required></div>
      <div class="field"><label for="f-desafio">${t('Seu desafio', 'Your challenge', 'Votre défi')}</label><textarea id="f-desafio" name="desafio" rows="4" required></textarea></div>
      <button class="btn" type="submit">${t('Solicitar diagnóstico', 'Request a diagnosis', 'Demander un diagnostic')}</button>
      <p class="form__status" data-form-status role="status"></p>
    </form>
  </div>
</section>

</main>`;
}

// ------------------------------------------------------- página de serviço ----
function servicePage(x, s) {
  const { t, href, tag } = x;
  const related = cases.find(c => c.service === s.id);
  const q = `?s=${s.id}`;
  return `
<main id="principal">

<section class="phero">
  <div class="wrap phero__in">
    <p class="crumb"><a href="${href('home', '#servicos')}">${t('Serviços', 'Services', 'Services')}</a><span aria-hidden="true">/</span>${t(C.pillars[s.pillar])}</p>
    <h1 class="phero__title">${t(s.name)}</h1>
    <p class="phero__lead">${t(s.outcome)}</p>
    <a class="btn" href="${href('home', '#contato', q)}">${t('Solicitar diagnóstico', 'Request a diagnosis', 'Demander un diagnostic')}</a>
  </div>
</section>

<section class="sec sec--white">
  <div class="wrap spec">
    <div class="spec__block spec__block--wide">
      <h2 class="spec__h">${t('Para quem é', 'Who it is for', 'Pour qui')}</h2>
      <p class="spec__big">${t(s.forWhom)}</p>
    </div>
    <div class="spec__block">
      <h2 class="spec__h">${t('O que fazemos', 'What we do', 'Ce que nous faisons')}</h2>
      <ol class="spec__list spec__list--n">${s.scope.map(i => `<li>${t(i)}</li>`).join('')}</ol>
    </div>
    <div class="spec__block">
      <h2 class="spec__h">${t('O que você recebe', 'What you get', 'Ce que vous recevez')}</h2>
      <ul class="spec__list">${s.receives.map(i => `<li>${t(i)}</li>`).join('')}</ul>
    </div>
    <div class="spec__block">
      <h2 class="spec__h">${t('Prazo médio', 'Typical timeline', 'Délai moyen')}</h2>
      <p class="spec__num">${t(s.prazo)} ${FINAL ? '' : `<span class="tag-draft">${t('A validar', 'To confirm', 'À valider')}</span>`}</p>
      <p class="spec__note">${t('O prazo exato vem na proposta, depois do diagnóstico.', 'The exact timeline comes with the proposal, after the diagnosis.', 'Le délai exact figure dans la proposition, après le diagnostic.')}</p>
    </div>
  </div>
</section>

${related ? `<section class="sec">
  <div class="wrap">
    <div class="head"><h2 class="head__title">${t('Um case deste serviço', 'A case from this service', 'Une réalisation de ce service')}</h2></div>
    <ul class="cases cases--one">${caseCard(x, related)}</ul>
  </div>
</section>` : ''}

<section class="sec${related ? ' sec--white' : ''}">
  <div class="wrap">
    <div class="head"><h2 class="head__title">${t('Como o projeto acontece', 'How the project runs', 'Comment se déroule le projet')}</h2></div>
    ${methodList(x)}
  </div>
</section>

<section class="sec${related ? '' : ' sec--white'}">
  <div class="wrap faq">
    <h2 class="head__title">${t('Perguntas frequentes', 'Common questions', 'Questions fréquentes')}</h2>
    <div class="faq__list">
      ${C.faq.map(f => `<details class="faq__item"><summary>${t(f.q)}</summary><p>${t(f.a)}</p></details>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="sec sec--tight${related ? ' sec--white' : ''}">
  <div class="wrap">
    <h2 class="spec__h">${t('Outros serviços', 'Other services', 'Autres services')}</h2>
    <ul class="others">
      ${C.services.filter(o => o.id !== s.id).map(o => `<li><a href="${href('svc:' + o.id)}"><span>${t(o.name)}</span>${icon.arrow}</a></li>`).join('\n      ')}
    </ul>
  </div>
</section>
${ctaBand(x, q)}
</main>`;
}

// ----------------------------------------------------------- faça parte ----
function joinPage(x) {
  const { t, tag } = x;
  return `
<main id="principal">

<section class="phero">
  <div class="wrap phero__in">
    <p class="crumb">${t('Para estudantes da SKEMA em Belo Horizonte', 'For SKEMA students in Belo Horizonte', 'Pour les étudiants de SKEMA à Belo Horizonte')}</p>
    <h1 class="phero__title">${t('Faça parte da SKJR', 'Join SKJR', 'Rejoignez SKJR')}</h1>
    <p class="phero__lead">${t(
      'Projetos reais, clientes reais e uma rede em quatro continentes, ainda na graduação.',
      'Real projects, real clients and a network on four continents, while you are still at university.',
      'De vrais projets, de vrais clients et un réseau sur quatre continents, dès vos études.')}</p>
    <a class="btn" href="${C.site.instagram}" rel="noopener" target="_blank">${t('Acompanhar o processo seletivo no Instagram', 'Follow the selection process on Instagram', 'Suivre le recrutement sur Instagram')}</a>
  </div>
</section>

<section class="sec sec--white">
  <div class="wrap">
    <div class="head"><h2 class="head__title">${t('O que você leva da SKJR', 'What you take from SKJR', 'Ce que SKJR vous apporte')}</h2></div>
    <ul class="reasons">
      ${C.join.reasons.map(r => `<li class="reason"><h3>${t(r.title)}</h3><p>${t(r.text)}</p></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="sec">
  <div class="wrap spec">
    <div class="spec__block spec__block--wide">
      <h2 class="spec__h">${t('Onde você pode atuar', 'Where you can work', 'Où vous pouvez agir')}</h2>
      <p class="spec__big">${t(C.areas)}.</p>
    </div>
  </div>
</section>

${selection.length ? `<section class="sec sec--white">
  <div class="wrap">
    <div class="head">
      <h2 class="head__title">${t('Como funciona o processo seletivo', 'How the selection process works', 'Comment se déroule le recrutement')}</h2>
      <p class="head__lead">${t('As datas de cada edição saem no nosso Instagram.', 'Dates for each intake are announced on our Instagram.', 'Les dates de chaque session sont annoncées sur notre Instagram.')}</p>
    </div>
    <ol class="steps">
      ${selection.map((s, i) => `<li class="step">
        <span class="step__n" aria-hidden="true">${i + 1}</span>
        <h3 class="step__title">${t(s.title)} ${tag(s)}</h3>
        <p class="step__text">${t(s.text)}</p>
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>` : ''}

<section class="band">
  <div class="wrap band__in">
    <h2 class="band__title">${t('Ficou com alguma dúvida?', 'Any questions?', 'Une question ?')}</h2>
    <div>
      <p>${t('Escreva para a gente. Quem responde é um membro da SKJR.', 'Write to us. An SKJR member will answer.', 'Écrivez-nous. Un membre de SKJR vous répondra.')}</p>
      <a class="btn btn--inv" href="mailto:${C.site.email}?subject=${encodeURIComponent(t('Processo seletivo SKJR', 'SKJR selection process', 'Recrutement SKJR'))}">${t('Enviar e-mail', 'Send an email', 'Envoyer un e-mail')}</a>
    </div>
  </div>
</section>
</main>`;
}

// ------------------------------------------------------------------ layout ----
function pageData(x) {
  const { t, href, lang, key } = x;
  const data = {
    lang: HTML_LANG[lang],
    email: C.site.email,
    endpoint: C.site.formEndpoint,
    i18n: {
      sent: t('Pedido de diagnóstico enviado. Respondemos em até 24h.', 'Diagnosis request sent. We reply within 24h.', 'Demande de diagnostic envoyée. Nous répondons sous 24 h.'),
      mail: t('Abrimos o seu e-mail com a mensagem pronta. Envie por lá para concluir.', 'We opened your email app with the message ready. Send it from there to finish.', 'Votre messagerie s’est ouverte avec le message prêt. Envoyez-le pour terminer.'),
      error: t(`Não foi possível enviar agora. Escreva para ${C.site.email} ou chame no WhatsApp.`, `We could not send it right now. Write to ${C.site.email} or message us on WhatsApp.`, `L’envoi a échoué. Écrivez à ${C.site.email} ou contactez-nous sur WhatsApp.`),
      invalid: t('Preencha os campos destacados.', 'Fill in the highlighted fields.', 'Remplissez les champs signalés.'),
      subject: t('Pedido de diagnóstico', 'Diagnosis request', 'Demande de diagnostic'),
      labels: [t('Nome', 'Name', 'Nom'), t('Empresa', 'Company', 'Entreprise'), t('Contato', 'Contact', 'Contact'), t('Desafio', 'Challenge', 'Défi')],
      interest: t('Tenho interesse em: {service}.', 'I am interested in: {service}.', 'Je suis intéressé(e) par : {service}.'),
    },
  };
  if (key === 'home') {
    data.diag = {
      sizes: Object.fromEntries(C.diag.sizes.map(s => [s.id, { label: t(s.label), note: t(s.note) }])),
      challenges: Object.fromEntries(C.diag.challenges.map(c => [c.id, { label: t(c.label), service: c.service }])),
      start: t('Começaríamos por', 'We would start with', 'Nous commencerions par'),
      gets: t('O que você recebe', 'What you get', 'Ce que vous recevez'),
      cta: t('Solicitar diagnóstico com estas respostas', 'Request a diagnosis with these answers', 'Demander un diagnostic avec ces réponses'),
      more: t('Ver o serviço', 'See the service', 'Voir le service'),
      msg: t('Porte: {size}. Maior desafio: {challenge}. Serviço sugerido: {service}.', 'Company size: {size}. Biggest challenge: {challenge}. Suggested service: {service}.', 'Taille : {size}. Défi principal : {challenge}. Service suggéré : {service}.'),
    };
    data.services = Object.fromEntries(C.services.map(s => [s.id, {
      name: t(s.name), outcome: t(s.outcome), receives: s.receives.map(r => t(r)), url: href('svc:' + s.id),
    }]));
  }
  return `<script id="page-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function layout(x, { title, description, body }) {
  const { lang, key, asset } = x;
  const abs = l => (C.site.url ? `${C.site.url}/${routes[key][l].replace(/index\.html$/, '')}` : '');
  const jsonld = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: C.site.name, alternateName: C.site.short,
    description, email: C.site.email, areaServed: 'Belo Horizonte, MG',
    address: { '@type': 'PostalAddress', addressLocality: 'Belo Horizonte', addressRegion: 'MG', addressCountry: 'BR' },
    parentOrganization: { '@type': 'Organization', name: 'SKEMA Conseil' },
    ...(C.site.url ? { url: C.site.url } : {}),
  };
  return `<!doctype html>
<html lang="${HTML_LANG[lang]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#1E3FBD">
${FINAL ? '' : '<meta name="robots" content="noindex">'}
${C.site.url ? `<link rel="canonical" href="${abs(lang)}">
${LANGS.map(l => `<link rel="alternate" hreflang="${HTML_LANG[l]}" href="${abs(l)}">`).join('\n')}
<meta property="og:url" content="${abs(lang)}">
<meta property="og:image" content="${C.site.url}/assets/img/og.png">` : ''}
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:locale" content="${{ pt: 'pt_BR', en: 'en_US', fr: 'fr_FR' }[lang]}">
<link rel="icon" href="${asset('img/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,300..600;1,8..60,300..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${asset('css/style.css')}?v=${V.css}">
<script type="application/ld+json">${JSON.stringify(jsonld)}</script>
</head>
<body class="page-${key.split(':')[0]}">
${header(x)}
${body}
${footer(x)}
${pageData(x)}
<script src="${asset('js/main.js')}?v=${V.js}" defer></script>
</body>
</html>
`;
}

// ------------------------------------------------------------------ build ----
const out = (file, html) => {
  const full = path.join(ROOT, file);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, html.replace(/\n\s*\n\s*\n/g, '\n\n'));
};

let count = 0;
for (const lang of LANGS) {
  let x = context(lang, 'home');
  const t = x.t;
  out(x.file, layout(x, {
    title: t('SKEMA Consultoria Júnior | Pesquisa, estratégia e marketing em Belo Horizonte',
      'SKEMA Consultoria Júnior | Research, strategy and marketing in Belo Horizonte',
      'SKEMA Consultoria Júnior | Études, stratégie et marketing à Belo Horizonte'),
    description: t('A única empresa júnior internacional do Brasil. Pesquisa de mercado, cliente oculto, gestão, marketing e identidade visual para empresas de Belo Horizonte.',
      'Brazil’s only international junior enterprise. Market research, mystery shopping, management, marketing and visual identity for companies in Belo Horizonte.',
      'La seule Junior-Entreprise internationale du Brésil. Études de marché, client mystère, gestion, marketing et identité visuelle pour les entreprises de Belo Horizonte.'),
    body: home(x),
  }));
  count++;

  for (const s of C.services) {
    x = context(lang, 'svc:' + s.id);
    out(x.file, layout(x, {
      title: `${x.t(s.name)} ${x.t('em Belo Horizonte', 'in Belo Horizonte', 'à Belo Horizonte')} | ${C.site.name}`,
      description: x.t(s.outcome),
      body: servicePage(x, s),
    }));
    count++;
  }

  x = context(lang, 'join');
  out(x.file, layout(x, {
    title: `${x.t('Faça parte', 'Join us', 'Nous rejoindre')} | ${C.site.name}`,
    description: x.t('Projetos reais, mentoria docente e uma rede em quatro continentes para estudantes da SKEMA em Belo Horizonte.',
      'Real projects, faculty mentoring and a network on four continents for SKEMA students in Belo Horizonte.',
      'De vrais projets, un mentorat académique et un réseau sur quatre continents pour les étudiants de SKEMA à Belo Horizonte.'),
    body: joinPage(x),
  }));
  count++;
}

// sitemap e robots (só com domínio definido)
if (C.site.url) {
  const urls = Object.values(routes).flatMap(r => LANGS.map(l => `${C.site.url}/${r[l].replace(/index\.html$/, '')}`));
  out('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  out('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${C.site.url}/sitemap.xml\n`);
}

// ---------------------------------------------------------------- resumo ----
const pend = [];
const n = (arr, name) => { const k = arr.filter(i => i.ilustrativo).length; if (k) pend.push(`${k} ${name}`); };
n(C.stats, 'número(s) da faixa sem valor oficial'); if (!C.teamPhoto) pend.push('sem foto real da equipe (teamPhoto)');
n(C.cases, 'case(s) ilustrativo(s)'); n(C.testimonials, 'depoimento(s) ilustrativo(s)'); n(C.team, 'membro(s) da equipe sem nome/foto');
n(C.articles, 'conteúdo(s) ilustrativo(s)'); n(C.join.selection, 'etapa(s) do processo seletivo a confirmar');
if (!C.clients.length) pend.push('nenhum logo de cliente');
if (C.site.contatosProvisorios) pend.push('contatos provisórios (e-mail, WhatsApp, Instagram)');
if (!C.site.url) pend.push('domínio não definido (site.url): sem canonical, sitemap e robots');
if (!C.site.formEndpoint) pend.push('formulário sem endpoint: abre o e-mail do visitante');

console.log(`\n${count} páginas geradas (${FINAL ? 'VERSÃO FINAL' : 'rascunho'}).`);
if (pend.length) console.log(`\nPendências de conteúdo em src/content.mjs:\n${pend.map(p => '  - ' + p).join('\n')}\n`);
