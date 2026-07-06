# Convite Interativo — João Miguel · 12 anos 🍃

Site de convite de aniversário com tema ninja elegante (folhas, fumaça,
pergaminho, partículas), pronto para abrir no navegador ou virar um PWA.

## Como abrir

Basta abrir `index.html` em qualquer navegador (duplo clique) ou, melhor
ainda, hospedar a pasta inteira em um serviço gratuito como:

- **Netlify Drop** (netlify.com/drop) — arraste a pasta e pronto
- **Vercel**
- **GitHub Pages**

Isso é importante porque o link do WhatsApp e o botão "Ver localização"
funcionam melhor quando o site está online (fácil de compartilhar por link).

## Onde adicionar as fotos

Coloque os arquivos dentro de `assets/fotos/`:

| Arquivo | Onde aparece |
|---|---|
| `assets/fotos/foto-principal.jpg` | Foto grande no topo (hero), dentro do círculo dourado |
| `assets/fotos/foto1.jpg` | 1ª foto da galeria |
| `assets/fotos/foto2.jpg` | 2ª foto da galeria |

Enquanto os arquivos não existirem, o site mostra um quadro elegante no
lugar, indicando o caminho — nada quebra visualmente.

### Adicionar mais fotos no futuro

Abra `script.js` e procure por `galleryPhotos` (perto da seção 6). Basta
acrescentar uma linha nova, por exemplo:

```js
const galleryPhotos = [
  { src: "assets/fotos/foto1.jpg", caption: "João Miguel", tilt: "-3deg" },
  { src: "assets/fotos/foto2.jpg", caption: "João Miguel", tilt: "2deg" },
  { src: "assets/fotos/foto3.jpg", caption: "João Miguel", tilt: "-1deg" }, // nova foto
];
```

## Música de fundo (opcional)

Coloque um arquivo em `assets/musicas/tema.mp3`. A música **não** toca
automaticamente (respeitando o visitante); existe um botão 🔇 no canto
inferior direito para ativar/desativar.

## Confirmação de presença (RSVP)

O botão "ACEITAR MISSÃO" abre o WhatsApp já com o número
**+55 27 99884-7045** e a mensagem:

> "Olá! Confirmo minha presença no aniversário de 12 anos do João Miguel
> no dia 27 de agosto às 16h. 🎉"

Para alterar o número ou a mensagem, edite as constantes `WHATSAPP_NUMBER`
e `WHATSAPP_MESSAGE` em `script.js` (seção 8).

## Local no mapa

O botão "Ver localização" abre o link do Google Maps informado. Para
trocar, edite o `href` do botão `#mapButton` em `index.html`.

## Contagem regressiva

A data-alvo (27/08/2026 16:00) está em `script.js`, função
`startCountdown()`. Se a data da festa mudar, ajuste ali
(`new Date(2026, 7, 27, 16, 0, 0)` — atenção: o mês em JavaScript começa em
0, então 7 = agosto. Ex.: janeiro = 0, fevereiro = 1 ... dezembro = 11).

## Virar PWA (instalar como app)

Já está preparado com `manifest.json` e `sw.js`. Para funcionar de forma
completa (ícone, "instalar app"), adicione dois ícones em
`assets/imagens/`:

- `icon-192.png` (192×192px)
- `icon-512.png` (512×512px)

PWAs exigem HTTPS para o service worker funcionar — funciona automaticamente
em Netlify, Vercel e GitHub Pages.

## Estrutura de pastas

```
convite-joao-miguel/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── sw.js
└── assets/
    ├── fotos/       ← fotos do João Miguel
    ├── imagens/     ← ícones do PWA
    ├── musicas/     ← música de fundo opcional
    └── efeitos/     ← reservado para sons/efeitos futuros
```

## Sobre o tema

O visual usa elementos originais inspirados no universo ninja (pergaminhos,
selos, fumaça, folhas, símbolos) em tom elegante e adulto — sem usar
personagens ou logotipos de nenhuma obra protegida por direitos autorais.
