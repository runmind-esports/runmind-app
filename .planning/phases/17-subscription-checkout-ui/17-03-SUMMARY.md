---
phase: 17-subscription-checkout-ui
plan: 03
subsystem: subscription-integration
tags: [subscription, sidebar, chat, upgrade, tier]
dependency_graph:
  requires: [17-01]
  provides: [real-tier-display, upgrade-button-chat]
  affects: [useUserProfile, Sidebar, useChat, MessageBubble]
tech_stack:
  added: []
  patterns: [MessageAction-type-for-inline-actions]
key_files:
  created: []
  modified:
    - src/shared/hooks/useUserProfile.ts
    - src/features/chat/components/Sidebar/Sidebar.tsx
    - src/features/chat/types/index.ts
    - src/features/chat/hooks/useChat.ts
    - src/features/chat/components/MessageBubble.tsx
decisions:
  - useUserProfile delegates tier fetching to useUserTier hook from subscription module
  - UpgradeButton component embedded in MessageBubble rather than separate file for locality
metrics:
  duration: 173s
  completed: 2026-04-28T01:31:29Z
  tasks: 2/2
  files: 5
---

# Phase 17 Plan 03: Tier Display & Upgrade Integration Summary

Connect useUserProfile to real backend tier via useUserTier, show colored badges in sidebar for Pro/Premium, and add inline upgrade button to 429 rate limit messages in chat.

## What Was Done

### Task 1: Connect useUserProfile to real tier and add sidebar badge
- **useUserProfile.ts**: Imported `useUserTier` from subscription module, replaced hardcoded `plan: 'Free'` with dynamic tier from backend, added `tier` field to `UserProfileData` interface, combined loading states
- **Sidebar.tsx**: Destructures `tier` from `useUserProfile()`, renders green pill badge for Pro (`bg-[#00F048]/15`), gold pill badge for Premium (`bg-amber-400/15`), plain text for Free
- **Commit:** `166e53a`

### Task 2: Add upgrade button to 429 rate limit message
- **types/index.ts**: Added `MessageAction` interface with `label` and `type` fields, added optional `action` field to `Message` interface
- **useChat.ts**: Updated 429 handler to include `action: { label: 'Fazer upgrade', type: 'upgrade' }` in the rate limit message
- **MessageBubble.tsx**: Added `UpgradeButton` component that calls `subscriptionApi.checkout('pro_monthly')` and redirects to Stripe via `window.location.href`, with loading spinner and disabled state during checkout
- **Commit:** `4f4ebad`

## Deviations from Plan

None - plan executed exactly as written.

## Verification

- `npm run build` passes cleanly
- useUserProfile no longer contains hardcoded 'Free'
- Sidebar shows conditional badge rendering for pro/premium tiers
- 429 message includes upgrade action with 'Fazer upgrade' button
- All TypeScript compiles without errors

## Self-Check: PASSED
