# 260619-fv3 — Smoke Test Runbook (PWA Install Button)

Operador executa cada cenário e marca `[x]` quando aprovado. Sign-off final no fim.

URL de produção: <https://runmind-app-620849332552.us-central1.run.app>
URL local (dev): <http://localhost:3000>

---

## Cenário 1 — Chrome Desktop (Mac/Windows/Linux)

- [ ] Abrir a landing page (produção ou `npm run dev`).
- [ ] DevTools → **Application → Manifest**. Verificar:
  - Nome: `Runmind — Coach de Corrida com IA`
  - `theme_color`: `#00F048`
  - `display`: `standalone`
  - `start_url`: `/`
  - Dois ícones listados (192×192 e 512×512)
- [ ] DevTools → **Application → Service Workers** mostra `/sw.js` como "activated and is running", sem erros no console.
- [ ] No hero, o botão outlined **"Instalar app"** aparece poucos segundos após o load (Chromium dispara `beforeinstallprompt` após o engagement heuristic).
- [ ] Clicar em **"Instalar app"** → diálogo nativo do Chrome abre → clicar em **Install** → app é instalado no dock/desktop com o R-mark do Runmind.
- [ ] Relançar o PWA instalado: abre em janela standalone (sem chrome do navegador) e o botão "Instalar app" não aparece mais.

---

## Cenário 2 — Chrome Android

- [ ] Abrir a URL de produção em um aparelho Android.
- [ ] O botão outlined **"Instalar app"** aparece no hero.
- [ ] Tocar → mini-infobar / prompt nativo de instalação aparece com o ícone do Runmind → tocar em **Instalar** → o app é instalado e aparece no app drawer.
- [ ] Lançar do drawer: abre em janela standalone, barra de status na cor `#00F048`, splash screen mostra o ícone 512×512 sobre fundo branco.

---

## Cenário 3 — Safari iOS (iPhone)

- [ ] Abrir a URL de produção em Safari no iPhone.
- [ ] O botão outlined **"Instalar app"** aparece no hero (porque `isIOS && !isStandalone`).
- [ ] Tocar → modal abre com título **"Adicionar à Tela de Início"** e as 3 instruções em PT-BR.
- [ ] Seguir os passos: Share sheet → **Adicionar à Tela de Início** → **Adicionar**.
- [ ] Lançar do home screen: abre em standalone, status bar light, R-mark do Runmind visível no ícone.
- [ ] Reabrir Safari na landing após o install → o botão **continua aparecendo** (não detectamos estado "installed" no iOS de forma confiável; isso é esperado e aceitável dentro do escopo).

---

## Cenário 4 — Firefox Desktop (caso negativo)

- [ ] Abrir a URL de produção no Firefox.
- [ ] O botão **NÃO** aparece (Firefox não dispara `beforeinstallprompt` e não é iOS).
- [ ] Console sem erros relacionados ao registro do service worker (Firefox suporta SW — `/sw.js` registra normalmente).

---

## Cenário 5 — Já instalado (caso de exceção)

- [ ] Com o PWA já instalado (do cenário 1 ou 2), abrir a URL de produção numa aba normal do navegador (fora do app instalado).
- [ ] O botão "Instalar app" **AINDA aparece** na aba do navegador — comportamento esperado. `display-mode: standalone` só matcha dentro da janela do app instalado.
- [ ] Dentro da janela do PWA instalado, o botão "Instalar app" **NÃO** aparece.

---

## Sign-off

- [ ] Aprovado por: __________________________ Data: ____ / ____ / ______
