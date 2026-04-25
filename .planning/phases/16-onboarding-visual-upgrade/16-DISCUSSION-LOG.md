# Phase 16: Onboarding Visual Upgrade - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-25
**Phase:** 16-onboarding-visual-upgrade
**Areas discussed:** Illustrations & imagery, Animations & micro-interactions, Layout & visual hierarchy, Planilha celebration moment

---

## Illustrations & Imagery

| Option | Description | Selected |
|--------|-------------|----------|
| SVG illustrations | Custom flat/gradient SVGs, lightweight, scalable, themed with RunMind colors | ✓ |
| Lottie animations | Animated JSON from LottieFiles, ~50KB dependency | |
| Emoji-based with gradients | Large emojis + gradient backgrounds, lightweight but less premium | |
| Stock photos with overlay | Real running photos with dark overlay, heavier but authentic | |

**User's choice:** SVG illustrations
**Notes:** Flat modern with gradients style (Strava-like). RunMind palette: navy #14162E + neon green #00F048.

| Option | Description | Selected |
|--------|-------------|----------|
| Top hero area | Illustration above greeting, ~40% screen height. NRC-style. | ✓ |
| Background with text overlay | Full-bleed illustration as background | |
| Side accent / responsive | Desktop: beside form. Mobile: small top. | |

**User's choice:** Top hero area (~40% screen height)

| Option | Description | Selected |
|--------|-------------|----------|
| Flat modern with gradients | Clean flat shapes with subtle gradients in RunMind palette | ✓ |
| Minimalist line art | Thin-stroke outlines, abstract, elegant | |
| Bold geometric / abstract | Abstract shapes representing movement | |

**User's choice:** Flat modern with gradients

| Option | Description | Selected |
|--------|-------------|----------|
| All screens — per-question icons | Welcome hero + 48-64px icons per question + planilha celebration | ✓ |
| Welcome + Planilha only | Bookend screens only | |
| Welcome + Planilha + select questions | 3-4 key questions get illustrations | |

**User's choice:** All screens with per-question icons (48-64px)

---

## Animations & Micro-interactions

| Option | Description | Selected |
|--------|-------------|----------|
| Medium — polished essentials | Upgrade transitions + fade-in, progress spring, button scale, stagger. CSS only. | ✓ |
| High — full motion design | All of medium + SVG animations, parallax, particles. May need framer-motion. | |
| Light — refine existing only | Smooth existing transitions, subtle hover states | |

**User's choice:** Medium — polished essentials (CSS/Tailwind only, no library)

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — staggered cascade | Options fade+slide in with ~80ms delay. CSS animation-delay. | ✓ |
| No — all appear at once | Options appear instantly | |

**User's choice:** Staggered cascade

| Option | Description | Selected |
|--------|-------------|----------|
| Scale bounce + checkmark | Quick scale(1.02) bounce + green checkmark icon. CSS only. | ✓ |
| Green border glow | Green glow/shadow ring | |
| You decide | Claude picks | |

**User's choice:** Scale bounce + checkmark

---

## Layout & Visual Hierarchy

| Option | Description | Selected |
|--------|-------------|----------|
| Subtle gradient top section | Navy-to-transparent gradient behind illustration, fading to white | ✓ |
| Stay white, illustration only | Clean white, SVG provides visual interest | |
| Full dark background | Navy #14162E background, white text | |

**User's choice:** Subtle gradient top section

| Option | Description | Selected |
|--------|-------------|----------|
| Keep open layout | No card wrapper. Clean breathing room on mobile. | ✓ |
| Subtle card container | Light rounded card wrapping question + options | |
| You decide | Claude picks | |

**User's choice:** Keep open layout

---

## Planilha Celebration Moment

**User clarification:** Tela de planilha não será usada — removida do escopo.

| Option | Description | Selected |
|--------|-------------|----------|
| Direto para o chat | Submete perfil e redireciona sem tela intermediária | |
| Tela de sucesso rápida | Tela breve (2-3s) com "Perfil salvo!" e animação de check | ✓ |
| You decide | Claude decide | |

**User's choice:** Tela de sucesso rápida (2-3 segundos) antes de redirecionar ao chat

---

## Claude's Discretion

- Exact SVG illustration designs for each question
- Animation timing fine-tuning
- Gradient exact color stops
- Success screen visual details

## Deferred Ideas

- Dark mode for onboarding
- Lottie animations for future polish
