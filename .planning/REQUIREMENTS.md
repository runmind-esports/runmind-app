# Requirements: RunMind Onboarding

**Defined:** 2026-04-22
**Core Value:** Do cadastro à planilha personalizada em menos de 5 minutos — onboarding que converte visitante em corredor ativo.

## v1.1 Requirements

Requirements for the Onboarding milestone. Each maps to roadmap phases.

### Onboarding Step 1

- [ ] **ONB-01**: Após signup, usuário vê tela de boas-vindas com dados importados do Google/Strava (nome, email)
- [ ] **ONB-02**: Usuário pode confirmar/editar nome antes de prosseguir para o formulário

### Onboarding Step 2 (Formulário)

- [ ] **ONB-03**: Usuário seleciona objetivo atual (correr 5km, correr 10km, melhorar tempo 5k, melhorar tempo 10k)
- [ ] **ONB-04**: Usuário informa nível de condicionamento físico (escala 1-5)
- [ ] **ONB-05**: Usuário informa se já corre regularmente e faixa de km/semana (até 5km, até 10km, 11-20km, 21-30km, +30km)
- [ ] **ONB-06**: Usuário informa se já participou de provas oficiais (sim/não)
- [ ] **ONB-07**: Usuário informa pace médio atual (não sei, acima de 7:00, 6:00-7:00, 5:00-6:00, abaixo de 5:00)
- [ ] **ONB-08**: Usuário seleciona quantos dias por semana pode treinar (2, 3, 4, 5+)
- [ ] **ONB-09**: Usuário informa se pratica outras atividades e se tem lesão ou restrição médica (sim/não cada)
- [ ] **ONB-10**: Usuário escolhe preferência de treino (curtos e intensos, longos e moderados, tanto faz)
- [ ] **ONB-11**: Usuário escolhe se quer incluir treinos de força na planilha (sim/não)

### Planilha & Redirecionamento

- [ ] **ONB-12**: Após formulário, usuário vê tela "momento ahá" com mensagem de sucesso e planilha pronta para download
- [ ] **ONB-13**: Após download da planilha, usuário é redirecionado para a tela de chat

### Backend API

- [ ] **API-01**: Endpoint POST no runmid-api (Go) para persistir perfil do corredor no banco de dados
- [ ] **API-02**: Endpoint GET no runmid-api (Go) para gerar e retornar planilha personalizada baseada no perfil

## Future Requirements

### Onboarding Enhancements

- **ONB-F01**: Onboarding via chat com IA (conversa humanizada em vez de formulário)
- **ONB-F02**: Import de histórico de corridas do Strava para pré-preencher campos
- **ONB-F03**: Recomendação de plano baseada em dados Strava (pace, volume, frequência)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Pagamento/assinatura durante onboarding | Onboarding é grátis, pricing vem depois |
| Onboarding via chat com IA | v1.1 usa formulário, chat IA é future |
| Edição de perfil pós-onboarding | Pode ser adicionado em settings futuramente |
| Geração de planilha com IA generativa | v1.1 usa templates baseados no perfil |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ONB-01 | — | Pending |
| ONB-02 | — | Pending |
| ONB-03 | — | Pending |
| ONB-04 | — | Pending |
| ONB-05 | — | Pending |
| ONB-06 | — | Pending |
| ONB-07 | — | Pending |
| ONB-08 | — | Pending |
| ONB-09 | — | Pending |
| ONB-10 | — | Pending |
| ONB-11 | — | Pending |
| ONB-12 | — | Pending |
| ONB-13 | — | Pending |
| API-01 | — | Pending |
| API-02 | — | Pending |

**Coverage:**
- v1.1 requirements: 15 total
- Mapped to phases: 0
- Unmapped: 15

---
*Requirements defined: 2026-04-22*
*Last updated: 2026-04-22 after milestone v1.1 definition*
