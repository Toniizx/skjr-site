// =============================================================================
//  CONTEÚDO DO SITE — SKEMA Consultoria Júnior
//  Tudo o que é texto, número, case, pessoa ou contato mora neste arquivo.
//  Cada texto tem três versões: L('português', 'english', 'français').
//  Depois de editar, rode:  node src/build.mjs          (rascunho)
//                           node src/build.mjs --final  (versão para publicar)
//
//  Itens com `ilustrativo: true` são exemplos de formato. No rascunho aparecem
//  com a etiqueta "Ilustrativo"; na versão final eles NÃO são publicados.
//  Para publicar um item, troque o conteúdo pelo real e apague `ilustrativo`.
// =============================================================================

export const L = (pt, en, fr) => ({ pt, en, fr });

// -----------------------------------------------------------------------------
//  Dados gerais e contatos  (os três contatos abaixo são provisórios: trocar)
// -----------------------------------------------------------------------------
export const site = {
  name: 'SKEMA Consultoria Júnior',
  short: 'SKJR',
  url: '',                                   // ex.: 'https://www.skjr.com.br' (sem barra no final)
  email: 'contato@seudominio.com.br',        // TROCAR
  whatsapp: '5531999999999',                 // TROCAR — só números, com 55 + DDD
  instagram: 'https://www.instagram.com/',   // TROCAR — link do perfil
  instagramHandle: '@perfil.da.skjr',        // TROCAR
  linkedin: '',                              // opcional — link da página
  formEndpoint: '',                          // opcional — URL que recebe o formulário (Formspree, Basin, etc.)
  contatosProvisorios: true,                 // mude para false depois de trocar os contatos acima
  year: 2026,
};

// -----------------------------------------------------------------------------
//  Números — a faixa segue o benchmarking: projetos entregues, NPS, membros e
//  rede SKEMA. Números fixos, sem contador animado. O de projetos é ilustrativo:
//  troque pelo número oficial (Financeiro + RH) e apague `ilustrativo`.
// -----------------------------------------------------------------------------
export const stats = [
  { ilustrativo: true, value: L('00', '00', '00'), label: L('projetos entregues', 'projects delivered', 'projets livrés') },
  { value: L('9,0', '9.0', '9,0'), label: L('NPS dos nossos clientes', 'NPS from our clients', 'NPS de nos clients') },
  { value: L('+40', '40+', '+40'), label: L('estudantes impactados', 'students impacted', 'étudiants impactés') },
  { value: L('6', '6', '6'), label: L('antenas da rede SKEMA em 4 continentes', 'SKEMA network branches on 4 continents', 'antennes du réseau SKEMA sur 4 continents') },
];

// Foto real da equipe (seção Sobre e página "Faça parte"). Paisagem, ex.: 3:2.
export const teamPhoto = 'assets/img/equipe/equipe-skjr.webp';

// -----------------------------------------------------------------------------
//  Clientes (logos). Deixe vazio até ter autorização.
//  Exemplo: { name: 'Empresa X', logo: 'assets/img/clientes/empresa-x.svg' }
// -----------------------------------------------------------------------------
export const clients = [];

// -----------------------------------------------------------------------------
//  Serviços
// -----------------------------------------------------------------------------
export const pillars = {
  research: L('Pesquisa', 'Research', 'Études'),
  strategy: L('Estratégia', 'Strategy', 'Stratégie'),
  marketing: L('Marketing', 'Marketing', 'Marketing'),
};

// `prazo` é uma estimativa a validar com a área de Projetos.
export const services = [
  {
    id: 'pesquisa',
    pillar: 'research',
    slug: L('pesquisa-de-mercado', 'market-research', 'etude-de-marche'),
    name: L('Pesquisa de mercado', 'Market research', 'Étude de marché'),
    outcome: L(
      'Decida com dados: quem é o seu cliente, quanto ele paga e onde está a concorrência.',
      'Decide with data: who your customer is, what they will pay and where the competition stands.',
      'Décidez avec des données : qui est votre client, combien il paie et où se situe la concurrence.'),
    forWhom: L(
      'Para quem vai abrir um ponto, lançar um produto ou falar com um novo público.',
      'For anyone opening a location, launching a product or reaching a new audience.',
      'Pour ouvrir un point de vente, lancer un produit ou toucher un nouveau public.'),
    scope: [
      L('Desenho da amostra e do questionário', 'Sample and questionnaire design', 'Conception de l’échantillon et du questionnaire'),
      L('Coleta por entrevistas, formulários e dados públicos', 'Fieldwork: interviews, surveys and public data', 'Collecte par entretiens, questionnaires et données publiques'),
      L('Análise quantitativa e qualitativa', 'Quantitative and qualitative analysis', 'Analyse quantitative et qualitative'),
      L('Recomendações em ordem de prioridade', 'Recommendations in order of priority', 'Recommandations classées par priorité'),
    ],
    receives: [
      L('Relatório com os achados', 'Findings report', 'Rapport de résultats'),
      L('Base de dados tratada', 'Cleaned dataset', 'Base de données nettoyée'),
      L('Apresentação executiva', 'Executive presentation', 'Présentation de synthèse'),
      L('Plano de ação', 'Action plan', 'Plan d’action'),
    ],
    prazo: L('4 a 8 semanas', '4 to 8 weeks', '4 à 8 semaines'),
  },
  {
    id: 'cliente-oculto',
    pillar: 'research',
    slug: L('cliente-oculto', 'mystery-shopping', 'client-mystere'),
    name: L('Cliente oculto', 'Mystery shopping', 'Client mystère'),
    outcome: L(
      'Veja o seu atendimento como o cliente vê: unidade por unidade, com nota e evidência.',
      'See your service the way customers do: location by location, with scores and evidence.',
      'Voyez votre service comme le voit le client : point de vente par point de vente, avec notes et preuves.'),
    forWhom: L(
      'Para redes, lojas, clínicas e restaurantes que querem padronizar o atendimento.',
      'For chains, shops, clinics and restaurants that want consistent service.',
      'Pour les réseaux, boutiques, cliniques et restaurants qui veulent un service homogène.'),
    scope: [
      L('Critérios de avaliação definidos com você', 'Evaluation criteria defined with you', 'Critères d’évaluation définis avec vous'),
      L('Visitas e contatos anônimos: loja, telefone, WhatsApp e site', 'Anonymous visits and contacts: in store, by phone, WhatsApp and web', 'Visites et contacts anonymes : boutique, téléphone, WhatsApp et site'),
      L('Pontuação padronizada por etapa do atendimento', 'Standard scoring for each step of the service', 'Notation standardisée à chaque étape du service'),
      L('Comparativo entre unidades e concorrentes', 'Comparison across locations and competitors', 'Comparatif entre points de vente et concurrents'),
    ],
    receives: [
      L('Roteiro de avaliação', 'Evaluation script', 'Grille d’évaluation'),
      L('Relatório por unidade, com notas', 'Report per location, with scores', 'Rapport par point de vente, avec notes'),
      L('Evidências de cada visita', 'Evidence from every visit', 'Preuves de chaque visite'),
      L('Plano de melhoria do atendimento', 'Service improvement plan', 'Plan d’amélioration du service'),
    ],
    prazo: L('3 a 5 semanas', '3 to 5 weeks', '3 à 5 semaines'),
  },
  {
    id: 'gestao',
    pillar: 'strategy',
    slug: L('consultoria-em-gestao', 'management-consulting', 'conseil-en-gestion'),
    name: L('Consultoria em gestão', 'Management consulting', 'Conseil en gestion'),
    outcome: L(
      'Processos, metas e indicadores claros para a empresa crescer sem depender só do dono.',
      'Clear processes, targets and metrics, so the company can grow without relying on the owner alone.',
      'Des processus, des objectifs et des indicateurs clairs, pour grandir sans dépendre uniquement du dirigeant.'),
    forWhom: L(
      'Para empresas que cresceram rápido e sentem a operação travar.',
      'For companies that grew fast and feel operations stalling.',
      'Pour les entreprises qui ont grandi vite et sentent leur organisation se gripper.'),
    scope: [
      L('Diagnóstico da operação', 'Operations assessment', 'Diagnostic de l’organisation'),
      L('Mapeamento e redesenho de processos', 'Process mapping and redesign', 'Cartographie et refonte des processus'),
      L('Definição de metas e indicadores', 'Targets and metrics', 'Définition des objectifs et des indicateurs'),
      L('Planejamento estratégico', 'Strategic planning', 'Planification stratégique'),
    ],
    receives: [
      L('Mapa dos processos atuais', 'Map of current processes', 'Cartographie des processus actuels'),
      L('Painel de indicadores', 'Metrics dashboard', 'Tableau de bord'),
      L('Plano de ação com responsáveis', 'Action plan with owners', 'Plan d’action avec responsables'),
      L('Rotina de acompanhamento', 'Follow-up routine', 'Rituel de suivi'),
    ],
    prazo: L('6 a 10 semanas', '6 to 10 weeks', '6 à 10 semaines'),
  },
  {
    id: 'marketing',
    pillar: 'marketing',
    slug: L('plano-de-marketing', 'marketing-plan', 'plan-marketing'),
    name: L('Plano de marketing', 'Marketing plan', 'Plan marketing'),
    outcome: L(
      'Um plano que cabe no seu orçamento e diz o que fazer a cada mês.',
      'A plan that fits your budget and says what to do each month.',
      'Un plan adapté à votre budget, qui dit quoi faire chaque mois.'),
    forWhom: L(
      'Para quem investe em divulgação e não sabe o que está dando retorno.',
      'For anyone spending on promotion without knowing what pays off.',
      'Pour ceux qui investissent en communication sans savoir ce qui rapporte.'),
    scope: [
      L('Diagnóstico de canais e concorrentes', 'Channel and competitor review', 'Diagnostic des canaux et des concurrents'),
      L('Definição de público e posicionamento', 'Audience and positioning', 'Définition de la cible et du positionnement'),
      L('Escolha de canais e orçamento', 'Channel and budget choices', 'Choix des canaux et du budget'),
      L('Metas e métricas por canal', 'Targets and metrics per channel', 'Objectifs et indicateurs par canal'),
    ],
    receives: [
      L('Diagnóstico de marketing', 'Marketing assessment', 'Diagnostic marketing'),
      L('Posicionamento e público definidos', 'Defined positioning and audience', 'Positionnement et cible définis'),
      L('Calendário de ações mês a mês', 'Month-by-month action calendar', 'Calendrier d’actions mois par mois'),
      L('Painel de métricas', 'Metrics dashboard', 'Tableau de bord'),
    ],
    prazo: L('4 a 6 semanas', '4 to 6 weeks', '4 à 6 semaines'),
  },
  {
    id: 'identidade',
    pillar: 'marketing',
    slug: L('identidade-visual', 'visual-identity', 'identite-visuelle'),
    name: L('Identidade visual', 'Visual identity', 'Identité visuelle'),
    outcome: L(
      'Uma marca coerente em todos os pontos de contato, do Instagram à fachada.',
      'A consistent brand at every touchpoint, from Instagram to the storefront.',
      'Une marque cohérente sur tous les points de contact, d’Instagram à la devanture.'),
    forWhom: L(
      'Para negócios novos ou marcas que não representam mais o que a empresa é.',
      'For new businesses, or brands that no longer reflect the company.',
      'Pour les nouvelles entreprises ou les marques qui ne reflètent plus l’entreprise.'),
    scope: [
      L('Imersão na marca e no público', 'Brand and audience immersion', 'Immersion dans la marque et son public'),
      L('Caminhos criativos para escolha', 'Creative routes to choose from', 'Pistes créatives au choix'),
      L('Refinamento com você', 'Refinement with you', 'Affinage avec vous'),
      L('Entrega dos arquivos finais', 'Handover of final files', 'Livraison des fichiers finaux'),
    ],
    receives: [
      L('Logotipo e variações', 'Logo and variations', 'Logo et déclinaisons'),
      L('Paleta de cores e tipografia', 'Colour palette and typography', 'Palette de couleurs et typographie'),
      L('Manual de marca', 'Brand guidelines', 'Charte graphique'),
      L('Aplicações: redes sociais, papelaria e fachada', 'Applications: social media, stationery and storefront', 'Applications : réseaux sociaux, papeterie et devanture'),
    ],
    prazo: L('3 a 6 semanas', '3 to 6 weeks', '3 à 6 semaines'),
  },
];

// -----------------------------------------------------------------------------
//  Como trabalhamos (prazos de 24h e 48h: compromissos da SKEMA Conseil)
// -----------------------------------------------------------------------------
export const steps = [
  {
    title: L('Diagnóstico', 'Diagnosis', 'Diagnostic'),
    mark: L('até 24h', 'within 24h', 'sous 24 h'),
    markLabel: L('para responder o seu contato', 'to answer your message', 'pour répondre à votre message'),
    text: L(
      'Uma conversa para entender o desafio, o contexto e o que seria um bom resultado para você.',
      'A conversation to understand the challenge, the context and what a good result looks like for you.',
      'Un échange pour comprendre le défi, le contexte et ce que serait un bon résultat pour vous.'),
  },
  {
    title: L('Proposta', 'Proposal', 'Proposition'),
    mark: L('até 48h', 'within 48h', 'sous 48 h'),
    markLabel: L('depois do diagnóstico', 'after the diagnosis', 'après le diagnostic'),
    text: L(
      'Escopo, prazo, entregáveis e investimento em um só documento, sem letra miúda.',
      'Scope, timeline, deliverables and investment in a single document, with no small print.',
      'Périmètre, délais, livrables et budget dans un seul document, sans petites lignes.'),
  },
  {
    title: L('Execução', 'Delivery', 'Réalisation'),
    text: L(
      'Uma equipe dedicada, com mentoria de professores da SKEMA e pontos de controle combinados com você.',
      'A dedicated team, mentored by SKEMA faculty, with checkpoints agreed with you.',
      'Une équipe dédiée, encadrée par des professeurs de SKEMA, avec des points d’étape convenus avec vous.'),
  },
  {
    title: L('Entrega e acompanhamento', 'Handover and follow-up', 'Livraison et suivi'),
    text: L(
      'Apresentação dos resultados, plano de ação e acompanhamento depois da entrega.',
      'Presentation of results, an action plan and follow-up after delivery.',
      'Présentation des résultats, plan d’action et suivi après la livraison.'),
  },
];

// -----------------------------------------------------------------------------
//  Cases — TODOS ILUSTRATIVOS. Levantar 3 a 5 reais com autorização do cliente.
//  `metric` é o número que vai na frente; `service` é o id de um serviço acima.
//  Opcionais: photo: 'assets/img/cases/x.jpg' (4:3) — o número vira um selo
//  sobre a foto, como nos cases da BCG — e logo: 'assets/img/clientes/x.svg'.
// -----------------------------------------------------------------------------
export const cases = [
  {
    ilustrativo: true,
    service: 'pesquisa',
    metric: L('312', '312', '312'),
    unit: L('entrevistas em 3 semanas', 'interviews in 3 weeks', 'entretiens en 3 semaines'),
    title: L(
      'Onde abrir a segunda loja: a resposta veio de 312 entrevistas',
      'Where to open the second shop: 312 interviews gave the answer',
      'Où ouvrir la deuxième boutique : 312 entretiens ont donné la réponse'),
    client: L('Nome do cliente, varejo, Belo Horizonte', 'Client name, retail, Belo Horizonte', 'Nom du client, commerce, Belo Horizonte'),
  },
  {
    ilustrativo: true,
    service: 'cliente-oculto',
    metric: L('+18%', '+18%', '+18 %'),
    unit: L('de conversão', 'conversion', 'de conversion'),
    title: L(
      'Atendimento no WhatsApp corrigido, conversão 18% maior',
      'WhatsApp service fixed, conversion up 18%',
      'Service WhatsApp corrigé, conversion en hausse de 18 %'),
    client: L('Nome do cliente, saúde, Grande BH', 'Client name, healthcare, Greater Belo Horizonte', 'Nom du client, santé, Grand Belo Horizonte'),
  },
  {
    ilustrativo: true,
    service: 'marketing',
    metric: L('+30%', '+30%', '+30 %'),
    unit: L('de vendas em 6 meses', 'sales in 6 months', 'de ventes en 6 mois'),
    title: L(
      'Novo plano de marketing, 30% a mais de vendas em seis meses',
      'New marketing plan, 30% more sales in six months',
      'Nouveau plan marketing, 30 % de ventes en plus en six mois'),
    client: L('Nome do cliente, alimentação, Belo Horizonte', 'Client name, food service, Belo Horizonte', 'Nom du client, restauration, Belo Horizonte'),
  },
];

// -----------------------------------------------------------------------------
//  Mini-diagnóstico
// -----------------------------------------------------------------------------
export const diag = {
  sizes: [
    { id: 'abrindo', label: L('Estou abrindo agora', 'Just starting out', 'En création'),
      note: L('Para quem está começando, o escopo costuma ser enxuto: focamos na decisão mais urgente.',
              'When you are just starting, scope stays lean: we focus on the most urgent decision.',
              'En phase de création, le périmètre reste resserré : nous visons la décision la plus urgente.') },
    { id: 'pequena', label: L('Micro ou pequena', 'Micro or small', 'Micro ou petite'),
      note: L('Em pequenas empresas, combinamos entregas curtas para você aplicar enquanto o projeto anda.',
              'With small companies, we plan short deliveries you can apply while the project is running.',
              'Avec les petites entreprises, nous prévoyons des livraisons courtes, applicables en cours de projet.') },
    { id: 'media', label: L('Média', 'Mid-sized', 'Moyenne'),
      note: L('Em empresas médias, envolvemos as áreas afetadas desde o diagnóstico.',
              'With mid-sized companies, we involve the affected teams from the diagnosis onwards.',
              'Avec les entreprises moyennes, nous impliquons les équipes concernées dès le diagnostic.') },
    { id: 'grande', label: L('Grande', 'Large', 'Grande'),
      note: L('Em grandes empresas, trabalhamos com um recorte: uma unidade, um produto ou uma região.',
              'With large companies, we work on one slice: a unit, a product or a region.',
              'Avec les grandes entreprises, nous travaillons sur un périmètre : une unité, un produit ou une région.') },
  ],
  challenges: [
    { id: 'mercado', service: 'pesquisa', label: L('Entender meu mercado', 'Understand my market', 'Comprendre mon marché') },
    { id: 'atendimento', service: 'cliente-oculto', label: L('Melhorar o atendimento', 'Improve customer service', 'Améliorer le service client') },
    { id: 'gestao', service: 'gestao', label: L('Organizar a gestão', 'Organise management', 'Structurer la gestion') },
    { id: 'vendas', service: 'marketing', label: L('Vender mais', 'Sell more', 'Vendre plus') },
    { id: 'marca', service: 'identidade', label: L('Renovar a marca', 'Refresh my brand', 'Renouveler ma marque') },
  ],
};

// -----------------------------------------------------------------------------
//  Rede SKEMA Conseil
// -----------------------------------------------------------------------------
export const manifesto = L(
  'Trabalhamos daqui, de Belo Horizonte, perto de quem conhece o mercado mineiro pelo nome. E pensamos com a SKEMA Conseil, nascida na França em 1969 e hoje presente em seis antenas e quatro continentes. Working local, thinking global.',
  'We work from here, in Belo Horizonte, close to the people who know the Minas Gerais market by name. And we think with SKEMA Conseil, born in France in 1969 and now present in six branches on four continents. Working local, thinking global.',
  'Nous travaillons d’ici, à Belo Horizonte, au plus près de ceux qui connaissent le marché du Minas Gerais par son nom. Et nous pensons avec SKEMA Conseil, née en France en 1969 et aujourd’hui présente dans six antennes sur quatre continents. Working local, thinking global.');

const FR = L('França', 'France', 'France');
const EU = L('Europa', 'Europe', 'Europe');
export const antennas = [
  { id: 'bh', home: true, city: L('Belo Horizonte', 'Belo Horizonte', 'Belo Horizonte'), country: L('Brasil', 'Brazil', 'Brésil'),
    continent: L('América do Sul', 'South America', 'Amérique du Sud'), tz: 'America/Sao_Paulo', lon: -43.94, lat: -19.92, label: [14, 5, 'start'] },
  { id: 'lille', city: L('Lille', 'Lille', 'Lille'), country: FR, continent: EU, tz: 'Europe/Paris', lon: 3.06, lat: 50.63, label: [12, -8, 'start'] },
  { id: 'paris', city: L('Paris', 'Paris', 'Paris'), country: FR, continent: EU, tz: 'Europe/Paris', lon: 2.35, lat: 48.86, label: [-12, 6, 'end'] },
  { id: 'nice', city: L('Nice', 'Nice', 'Nice'), country: FR, continent: EU, tz: 'Europe/Paris', lon: 7.26, lat: 43.70, label: [13, 6, 'start'] },
  { id: 'raleigh', city: L('Raleigh', 'Raleigh', 'Raleigh'), country: L('Estados Unidos', 'United States', 'États-Unis'),
    continent: L('América do Norte', 'North America', 'Amérique du Nord'), tz: 'America/New_York', lon: -78.64, lat: 35.78, label: [-13, 5, 'end'] },
  { id: 'dubai', city: L('Dubai', 'Dubai', 'Dubaï'), country: L('Emirados Árabes Unidos', 'United Arab Emirates', 'Émirats arabes unis'),
    continent: L('Ásia', 'Asia', 'Asie'), tz: 'Asia/Dubai', lon: 55.27, lat: 25.20, label: [13, 5, 'start'] },
];

// -----------------------------------------------------------------------------
//  Equipe e mentores
//  Para foto: acrescente  photo: 'assets/img/equipe/nome.jpg'  (retrato 4:5)
// -----------------------------------------------------------------------------
export const mentors = [
  { name: 'Rachel Patrocínio' },
  { name: 'Wilson Mendonça' },
  { name: 'Dorival Guimarães' },
];

export const team = [
  { ilustrativo: true, name: L('Nome do membro', 'Member name', 'Nom du membre'), role: L('Presidência', 'Presidency', 'Présidence') },
  { ilustrativo: true, name: L('Nome do membro', 'Member name', 'Nom du membre'), role: L('Projetos', 'Projects', 'Projets') },
  { ilustrativo: true, name: L('Nome do membro', 'Member name', 'Nom du membre'), role: L('Comercial', 'Sales', 'Commercial') },
  { ilustrativo: true, name: L('Nome do membro', 'Member name', 'Nom du membre'), role: L('Inovação', 'Innovation', 'Innovation') },
];

export const areas = L(
  'Presidência, Projetos, Comercial, Marketing, Inovação, Financeiro e RH',
  'Presidency, Projects, Sales, Marketing, Innovation, Finance and HR',
  'Présidence, Projets, Commercial, Marketing, Innovation, Finance et RH');

// -----------------------------------------------------------------------------
//  Depoimentos — só reais: nome, cargo, empresa e foto ou logo.
//  Opcionais: photo: 'assets/img/depoimentos/x.jpg' (quadrada) ou logo: 'assets/img/clientes/x.svg'
// -----------------------------------------------------------------------------
export const testimonials = [
  {
    ilustrativo: true,
    quote: L(
      'Aqui entra o depoimento real do cliente: o que mudou no negócio depois do projeto, de preferência com um número.',
      'The client’s real words go here: what changed in the business after the project, ideally with a number.',
      'Ici, le témoignage réel du client : ce qui a changé dans l’entreprise après le projet, idéalement avec un chiffre.'),
    name: L('Nome do cliente', 'Client name', 'Nom du client'),
    role: L('Cargo, Empresa', 'Role, Company', 'Fonction, Entreprise'),
  },
  {
    ilustrativo: true,
    quote: L(
      'Um segundo depoimento, de outro setor, mostra que o método funciona em negócios diferentes.',
      'A second testimonial, from another industry, shows the method works across different businesses.',
      'Un second témoignage, d’un autre secteur, montre que la méthode fonctionne dans des activités différentes.'),
    name: L('Nome do cliente', 'Client name', 'Nom du client'),
    role: L('Cargo, Empresa', 'Role, Company', 'Fonction, Entreprise'),
  },
];

// -----------------------------------------------------------------------------
//  Conteúdo (estudos e materiais do Skope). Quando houver link real, preencha `href`.
// -----------------------------------------------------------------------------
export const articles = [
  { ilustrativo: true, kind: L('Estudo do Skope', 'Skope study', 'Étude Skope'),
    title: L('Título do primeiro estudo publicado pela SKJR', 'Title of the first study published by SKJR', 'Titre de la première étude publiée par SKJR'), href: '' },
  { ilustrativo: true, kind: L('Guia', 'Guide', 'Guide'),
    title: L('Título de um guia prático para pequenas empresas', 'Title of a practical guide for small businesses', 'Titre d’un guide pratique pour les petites entreprises'), href: '' },
  { ilustrativo: true, kind: L('Artigo', 'Article', 'Article'),
    title: L('Título de um artigo com dados do mercado mineiro', 'Title of an article with Minas Gerais market data', 'Titre d’un article sur le marché du Minas Gerais'), href: '' },
];

// -----------------------------------------------------------------------------
//  Perguntas frequentes (páginas de serviço)
// -----------------------------------------------------------------------------
export const faq = [
  {
    q: L('Quem executa o projeto?', 'Who carries out the project?', 'Qui réalise le projet ?'),
    a: L('Uma equipe de estudantes da SKEMA Business School em Belo Horizonte, com mentoria de um professor do início ao fim.',
         'A team of SKEMA Business School students in Belo Horizonte, mentored by a faculty member from start to finish.',
         'Une équipe d’étudiants de SKEMA Business School à Belo Horizonte, encadrée par un professeur du début à la fin.'),
  },
  {
    q: L('Em quanto tempo recebo a proposta?', 'How soon will I get a proposal?', 'Sous quel délai vais-je recevoir la proposition ?'),
    a: L('Respondemos o seu contato em até 24h e enviamos a proposta em até 48h depois da conversa de diagnóstico.',
         'We answer your message within 24h and send the proposal within 48h of the diagnosis conversation.',
         'Nous répondons à votre message sous 24 h et envoyons la proposition sous 48 h après l’échange de diagnostic.'),
  },
  {
    q: L('Como é definido o investimento?', 'How is the investment defined?', 'Comment le budget est-il défini ?'),
    a: L('Cada proposta é feita sob medida, a partir do escopo combinado no diagnóstico. O valor, o prazo e os entregáveis vêm no mesmo documento.',
         'Each proposal is tailored to the scope agreed in the diagnosis. Price, timeline and deliverables come in the same document.',
         'Chaque proposition est sur mesure, à partir du périmètre convenu lors du diagnostic. Prix, délais et livrables figurent dans le même document.'),
  },
];

// -----------------------------------------------------------------------------
//  Página "Faça parte"
//  As etapas do processo seletivo são ILUSTRATIVAS: confirmar com RH.
// -----------------------------------------------------------------------------
export const join = {
  reasons: [
    { title: L('Projeto de verdade', 'Real projects', 'De vrais projets'),
      text: L('Você atende empresas de Belo Horizonte, do diagnóstico à entrega, com prazo e cliente reais.',
              'You work with companies in Belo Horizonte, from diagnosis to delivery, with real deadlines and real clients.',
              'Vous accompagnez des entreprises de Belo Horizonte, du diagnostic à la livraison, avec de vrais délais et de vrais clients.') },
    { title: L('Mentoria docente', 'Faculty mentoring', 'Mentorat académique'),
      text: L('Professores da SKEMA acompanham os projetos e a sua evolução.',
              'SKEMA faculty follow the projects and your own progress.',
              'Des professeurs de SKEMA suivent les projets et votre progression.') },
    { title: L('Rede internacional', 'International network', 'Réseau international'),
      text: L('Somos uma antena da SKEMA Conseil, com colegas em Lille, Paris, Nice, Raleigh e Dubai.',
              'We are a branch of SKEMA Conseil, with peers in Lille, Paris, Nice, Raleigh and Dubai.',
              'Nous sommes une antenne de SKEMA Conseil, avec des collègues à Lille, Paris, Nice, Raleigh et Dubaï.') },
  ],
  selection: [
    { ilustrativo: true, title: L('Inscrição', 'Application', 'Candidature'),
      text: L('Formulário on-line com seus dados e áreas de interesse.', 'An online form with your details and areas of interest.', 'Un formulaire en ligne avec vos coordonnées et vos centres d’intérêt.') },
    { ilustrativo: true, title: L('Dinâmica em grupo', 'Group exercise', 'Exercice de groupe'),
      text: L('Um caso curto resolvido em equipe.', 'A short case solved as a team.', 'Un cas court résolu en équipe.') },
    { ilustrativo: true, title: L('Entrevista', 'Interview', 'Entretien'),
      text: L('Conversa individual com membros da SKJR.', 'A one-to-one conversation with SKJR members.', 'Un échange individuel avec des membres de SKJR.') },
    { ilustrativo: true, title: L('Período trainee', 'Trainee period', 'Période d’intégration'),
      text: L('Capacitações e o primeiro projeto acompanhado.', 'Training sessions and a first supervised project.', 'Des formations et un premier projet accompagné.') },
  ],
};
