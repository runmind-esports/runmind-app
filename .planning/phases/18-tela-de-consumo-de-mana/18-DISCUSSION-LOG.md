# Phase 18: Tela de Consumo de Mana (kcal) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-04-28
**Phase:** 18-tela-de-consumo-de-mana
**Areas discussed:** Layout da secao, Dados exibidos, Visual da barra de kcal, Acao quando kcal acaba

---

## Layout da secao

| Option | Description | Selected |
|--------|-------------|----------|
| Nova tab "Consumo" | Terceira tab no settings. Dedicada. | Y |
| Dentro da tab Planos | Card dentro da tab existente. | |

**User's choice:** Nova tab "Consumo"

---

## Dados exibidos

| Option | Description | Selected |
|--------|-------------|----------|
| Simples: kcal + reset | So kcal atual/maximo e proximo reset. | |
| Completo: kcal + breakdown | Breakdown por tipo de operacao. | |
| Kcal + historico 7 dias | Mini grafico de barras com consumo dos ultimos 7 dias. | Y |

**User's choice:** Kcal + historico 7 dias

---

## Visual da barra de kcal

| Option | Description | Selected |
|--------|-------------|----------|
| Gauge circular | Circulo com porcentagem. Verde/amarelo/vermelho. Estilo fitness. | Y |
| Barra linear | Barra horizontal com gradiente. | |
| Card numerico + barra | Numero grande + barra fina. Minimalista. | |

**User's choice:** Gauge circular

---

## Acao quando kcal acaba

| Option | Description | Selected |
|--------|-------------|----------|
| Banner upgrade + countdown | Banner com botao upgrade e timer. | |
| Card motivacional + upgrade | Mensagem tematica de corrida com CTA e horario do reset. | Y |
| So countdown do reset | Sem upgrade. So mostra quando reseta. | |

**User's choice:** Card motivacional + upgrade

## Claude's Discretion

- Animacao do gauge
- Formato do timer de reset
- Skeleton loading state

## Deferred Ideas

- Breakdown por tipo de operacao
- Historico mensal
- Push notification quando kcal acabando
- Gamificacao: streak
