# Ziliu

Ziliu e uma SPA estatica para ensino de matematica com foco em storytelling visual, animacoes progressivas e uma experiencia premium moderna.

## Filosofia tecnica

- HTML, CSS e JavaScript puros.
- Sem npm, sem build tools e sem frameworks.
- GSAP, KaTeX, Lucide Icons e Inter carregados via CDN.
- Arquitetura modular em ES Modules.

## Como executar

Sirva a pasta com qualquer servidor estatico simples e abra a URL no navegador:

```powershell
py -m http.server 4173 --bind 127.0.0.1
```

Depois acesse:

```text
http://127.0.0.1:4173
```

O servidor local e necessario porque a SPA carrega `dados/manifesto.json` via `fetch()`. Muitos navegadores bloqueiam esse carregamento quando a pagina e aberta por `file://`; servir a pasta preserva a filosofia do projeto, porque nao adiciona npm, build tools ou dependencias ao codigo.

## Estrutura

- `css/`: reset, tokens visuais, layout, componentes, canvas, animacoes e responsividade.
- `js/`: orquestracao da SPA, navegacao, renderizacao, armazenamento, teclado, animacoes e utilitarios.
- `dados/`: manifesto e JSONs de aulas.
- `assets/`: espaco reservado para icones e sons futuros.

## Escopo desta etapa

Esta fundacao ainda nao implementa motor pedagogico, quizzes, SVG matematico, renderizacao matematica real ou timelines complexas. Ela prepara a plataforma para esses recursos com uma base limpa e expansivel.
