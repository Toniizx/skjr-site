# Site da SKEMA Consultoria Júnior

Site institucional da SKJR em português, inglês e francês. Ele segue a proposta do documento de benchmarking da área de Inovação (novembro de 2026): a home tem 13 seções, há uma página para cada serviço e uma página "Faça parte".

É HTML estático, sem framework e sem dependências. Para publicar, basta servir os arquivos, por exemplo no GitHub Pages, Netlify ou Vercel.

## Estrutura

```
src/content.mjs     todo o texto, números, cases, pessoas e contatos (PT / EN / FR)
src/art.mjs         desenho em linha do hero, mapa da rede SKEMA e ícones (SVG)
src/build.mjs       gera as páginas HTML a partir do conteúdo
assets/css/         estilos
assets/js/          interações (palavra que troca, manifesto, mapa, diagnóstico, formulário)
assets/img/         favicon e, no futuro, fotos e logos
index.html, servicos/, faca-parte.html, en/, fr/   páginas geradas (não editar à mão)
```

## Como editar

1. Edite `src/content.mjs`.
2. Gere as páginas de novo:

```bash
node src/build.mjs
```

O comando mostra a lista de pendências de conteúdo. Para gerar a versão de publicação, que esconde tudo o que ainda é ilustrativo:

```bash
node src/build.mjs --final
```

Para ver no computador:

```bash
python -m http.server 8080
```

Depois abra http://localhost:8080.

## Rascunho e versão final

No rascunho, os itens que ainda não têm conteúdo real aparecem com a etiqueta **Ilustrativo**. Eles estão marcados com `ilustrativo: true` em `content.mjs`. Na versão final (`--final`):

- os cases, depoimentos, membros e materiais ilustrativos somem. Se não houver nenhum item real, a seção inteira some.
- a faixa "Versão de rascunho" e a tag `noindex` saem.

## Antes de publicar (checklist do benchmarking)

- [ ] 3 a 5 cases reais, com número e autorização do cliente. Opcional: `photo` (4:3), em que o número vira um selo sobre a foto, e `logo` do cliente (Comercial + Projetos)
- [ ] Logos de clientes autorizados (`clients`) (Comercial)
- [ ] Números oficiais: projetos entregues, NPS, membros e anos (`stats`) (Financeiro + RH)
- [ ] Foto real da equipe em reunião ou com cliente (`teamPhoto`, 21:9) (Marketing)
- [ ] Fotos da equipe e dos mentores (campo `photo`, retrato 4:5) (Marketing)
- [ ] Depoimentos reais com `photo` (quadrada) ou `logo` da empresa (Comercial)
- [ ] Manual de marca: logo e cores. A cor fica em `--cobalt` no CSS e a marca provisória fica em `art.mjs` (Marketing)
- [ ] Contatos reais em `site` (e-mail, WhatsApp e Instagram), depois `contatosProvisorios: false`
- [ ] Domínio em `site.url`, que ativa canonical, hreflang, sitemap e robots
- [ ] Endpoint do formulário em `site.formEndpoint` (ex.: Formspree). Sem ele, o formulário abre o e-mail do visitante com a mensagem pronta.
- [ ] Prazos médios de cada serviço validados com Projetos
- [ ] Etapas do processo seletivo confirmadas com RH
- [ ] Uso da marca e do mapa da rede validado com a SKEMA Conseil (Presidência)
