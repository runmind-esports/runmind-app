# Requirements: RunMind Onboarding

**Defined:** 2026-04-22
**Core Value:** Do cadastro a planilha personalizada em menos de 5 minutos -- onboarding que converte visitante em corredor ativo.

## v1.1 Requirements

Requirements for the Onboarding milestone. Each maps to roadmap phases.

### Onboarding Step 1

- [ ] **ONB-01**: Apos signup, usuario ve tela de boas-vindas com dados importados do Google/Strava (nome, email)
- [ ] **ONB-02**: Usuario pode confirmar/editar nome antes de prosseguir para o formulario

### Onboarding Step 2 (Formulario)

- [ ] **ONB-03**: Usuario seleciona objetivo atual (correr 5km, correr 10km, melhorar tempo 5k, melhorar tempo 10k)
- [ ] **ONB-04**: Usuario informa nivel de condicionamento fisico (escala 1-5)
- [ ] **ONB-05**: Usuario informa se ja corre regularmente e faixa de km/semana (ate 5km, ate 10km, 11-20km, 21-30km, +30km)
- [ ] **ONB-06**: Usuario informa se ja participou de provas oficiais (sim/nao)
- [ ] **ONB-07**: Usuario informa pace medio atual (nao sei, acima de 7:00, 6:00-7:00, 5:00-6:00, abaixo de 5:00)
- [ ] **ONB-08**: Usuario seleciona quantos dias por semana pode treinar (2, 3, 4, 5+)
- [ ] **ONB-09**: Usuario informa se pratica outras atividades e se tem lesao ou restricao medica (sim/nao cada)
- [ ] **ONB-10**: Usuario escolhe preferencia de treino (curtos e intensos, longos e moderados, tanto faz)
- [ ] **ONB-11**: Usuario escolhe se quer incluir treinos de forca na planilha (sim/nao)

### Planilha & Redirecionamento

- [ ] **ONB-12**: Apos formulario, usuario ve tela "momento aha" com mensagem de sucesso e planilha pronta para download
- [ ] **ONB-13**: Apos download da planilha, usuario e redirecionado para a tela de chat

### Backend API

- [ ] **API-01**: Endpoint POST no runmid-api (Go) para persistir perfil do corredor no banco de dados
- [ ] **API-02**: Endpoint GET no runmid-api (Go) para gerar e retornar planilha personalizada baseada no perfil

## Future Requirements

### Onboarding Enhancements

- **ONB-F01**: Onboarding via chat com IA (conversa humanizada em vez de formulario)
- **ONB-F02**: Import de historico de corridas do Strava para pre-preencher campos
- **ONB-F03**: Recomendacao de plano baseada em dados Strava (pace, volume, frequencia)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Pagamento/assinatura durante onboarding | Onboarding e gratis, pricing vem depois |
| Onboarding via chat com IA | v1.1 usa formulario, chat IA e future |
| Edicao de perfil pos-onboarding | Pode ser adicionado em settings futuramente |
| Geracao de planilha com IA generativa | v1.1 usa templates baseados no perfil |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ONB-01 | Phase 6 | Pending |
| ONB-02 | Phase 6 | Pending |
| ONB-03 | Phase 6 | Pending |
| ONB-04 | Phase 6 | Pending |
| ONB-05 | Phase 6 | Pending |
| ONB-06 | Phase 6 | Pending |
| ONB-07 | Phase 6 | Pending |
| ONB-08 | Phase 6 | Pending |
| ONB-09 | Phase 6 | Pending |
| ONB-10 | Phase 6 | Pending |
| ONB-11 | Phase 6 | Pending |
| ONB-12 | Phase 7 | Pending |
| ONB-13 | Phase 7 | Pending |
| API-01 | Phase 5 | Pending |
| API-02 | Phase 5 | Pending |

**Coverage:**
- v1.1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after roadmap creation*
