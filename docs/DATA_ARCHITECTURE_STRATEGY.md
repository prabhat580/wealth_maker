# Data Architecture Strategy Document

**Date:** December 2024  
**Status:** Approved for Implementation  
**Scope:** Oracle Migration, CRM Optimization, CDP Integration

---

## Executive Summary

This document outlines the strategic decision to migrate from legacy Oracle infrastructure to a modern cloud-native architecture while optimizing our CRM and adding a CDP layer for enhanced client engagement.

**Key Decisions:**
- ✅ Migrate Oracle → Lovable Cloud (Postgres)
- ✅ Retain LeadSquared CRM for pre-client acquisition
- ✅ Add CDP layer (CleverTap/MoEngage) for post-client engagement
- ❌ Skip separate CDP for pre-client (CRM handles this)

---

## 1. Current State Assessment

### Pain Points
| System | Issue | Impact |
|--------|-------|--------|
| Oracle DB | Archaic, high licensing cost | ₹8-15L/year, maintenance overhead |
| LeadSquared | Good for acquisition, weak post-client | Limited lifecycle automation |
| No CDP | No behavioral analytics | Reactive vs proactive engagement |

### Current Data Flow
```
Oracle (Holdings/Txns) → Manual Reports → Advisors
LeadSquared (Leads) → Assignment → Pipeline → Conversion
Post-Client → Manual follow-ups, no automation
```

---

## 2. Target Architecture

### 2.1 System Responsibilities

| Layer | System | Responsibility |
|-------|--------|----------------|
| **Acquisition** | LeadSquared | Lead capture, assignment, pipeline, drip campaigns |
| **Source of Truth** | Lovable Cloud | Profiles, holdings, transactions, goals, KYC |
| **Engagement** | CDP (CleverTap/MoEngage) | Behavioral events, segments, journeys, alerts |
| **Intelligence** | Edge Functions | AI advisor, market data, sync orchestration |

### 2.2 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRE-CLIENT (ACQUISITION)                        │
├─────────────────────────────────────────────────────────────────────────┤
│  Website/Ads → LeadSquared → Assignment → Pipeline → Drip Campaigns    │
│                                    │                                    │
│                            [Conversion Event]                           │
│                                    ↓                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                      LOVABLE CLOUD (SOURCE OF TRUTH)                    │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌───────────────┐       │
│  │ profiles │  │ holdings │  │ transactions │  │  user_goals   │       │
│  └──────────┘  └──────────┘  └──────────────┘  └───────────────┘       │
│  ┌──────────────┐  ┌───────────────────┐  ┌─────────────────┐          │
│  │  kyc_records │  │ investor_profiles │  │  funnel_events  │          │
│  └──────────────┘  └───────────────────┘  └─────────────────┘          │
│                                    │                                    │
│                          [Event Sync Edge Fn]                           │
│                                    ↓                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                       CDP LAYER (POST-CLIENT ENGAGEMENT)                │
├─────────────────────────────────────────────────────────────────────────┤
│  Behavioral Events → Dynamic Segments → Lifecycle Journeys → Alerts    │
│                                                                         │
│  Example Journeys:                                                      │
│  • Goal milestone reached → Congratulation + next steps                 │
│  • Portfolio drift detected → Rebalancing recommendation                │
│  • SIP due date approaching → Payment reminder                          │
│  • Dormancy (30d no login) → Re-engagement campaign                     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Implementation Phases

### Phase 1: Database Migration (Weeks 1-3)

**Objective:** Replace Oracle with Cloud-native tables

| Task | Owner | Duration | Deliverable |
|------|-------|----------|-------------|
| Create `holdings` table | Dev | 2 days | Migration script |
| Create `transactions` table | Dev | 2 days | Migration script |
| Data migration scripts | Dev | 5 days | ETL pipeline |
| Validation & reconciliation | QA | 3 days | Audit report |
| Switch production reads | DevOps | 1 day | Cutover |
| Decommission Oracle | DevOps | Post-validation | License termination |

**New Tables Schema:**

```sql
-- Holdings table (replaces Oracle)
CREATE TABLE public.holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  asset_type TEXT NOT NULL, -- 'EQUITY', 'MF', 'BOND', 'FD', 'INSURANCE'
  asset_name TEXT NOT NULL,
  isin TEXT,
  quantity NUMERIC,
  avg_cost NUMERIC,
  current_value NUMERIC,
  unrealized_pnl NUMERIC,
  unrealized_pnl_pct NUMERIC,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table (replaces Oracle)
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(user_id),
  holding_id UUID REFERENCES public.holdings(id),
  txn_type TEXT NOT NULL, -- 'BUY', 'SELL', 'DIVIDEND', 'SIP', 'SWITCH'
  asset_name TEXT NOT NULL,
  quantity NUMERIC,
  price NUMERIC,
  amount NUMERIC NOT NULL,
  txn_date DATE NOT NULL,
  settlement_date DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Phase 2: LeadSquared Integration (Weeks 2-4)

**Objective:** Bi-directional sync between CRM and Cloud

| Task | Owner | Duration | Deliverable |
|------|-------|----------|-------------|
| Create `lead_sync_cache` table | Dev | 1 day | Migration |
| Build sync edge function | Dev | 3 days | `leadsquared-sync` |
| Webhook configuration | Dev | 1 day | Real-time triggers |
| Testing & validation | QA | 2 days | Integration tests |

**Sync Logic:**
- LeadSquared → Cloud: On lead conversion, create profile
- Cloud → LeadSquared: On goal creation, update lead activity

### Phase 3: CDP Integration (Weeks 4-6)

**Objective:** Enable behavioral analytics and automated engagement

| Task | Owner | Duration | Deliverable |
|------|-------|----------|-------------|
| CDP vendor selection | Product | 1 week | Contract signed |
| Create event schema | Dev | 2 days | Event taxonomy |
| Build sync edge function | Dev | 3 days | `cdp-event-push` |
| Configure segments | Marketing | 2 days | Segment definitions |
| Build lifecycle journeys | Marketing | 1 week | 5 core journeys |
| Go-live | All | 1 day | Production launch |

**Event Taxonomy:**

| Event | Trigger | Properties |
|-------|---------|------------|
| `user_login` | Auth success | device, location |
| `goal_created` | Goal saved | goal_type, target_amount, timeline |
| `goal_milestone` | Progress ≥25/50/75/100% | goal_id, milestone_pct |
| `transaction_completed` | New transaction | txn_type, amount, asset_type |
| `portfolio_drift` | Allocation delta >5% | drift_pct, asset_class |
| `kyc_completed` | KYC verified | kyc_source |
| `sip_due` | 3 days before SIP date | sip_amount, fund_name |

---

## 4. Cost Analysis

### Annual Cost Comparison

| Component | Current | Proposed | Delta |
|-----------|---------|----------|-------|
| Oracle DB License | ₹8-15L | ₹0 | **-₹8-15L** |
| LeadSquared CRM | ₹3-5L | ₹3-5L | ₹0 |
| CDP Platform | ₹0 | ₹2-4L | +₹2-4L |
| Cloud Compute | ₹1-2L | ₹1.5-3L | +₹0.5-1L |
| Edge Functions | ₹0 | ₹0.5-1L | +₹0.5-1L |
| **Total** | **₹12-22L** | **₹7-13L** | **-₹5-9L** |

### 3-Year TCO

| Scenario | Year 1 | Year 2 | Year 3 | 3-Year Total |
|----------|--------|--------|--------|--------------|
| Current (Oracle) | ₹17L | ₹18L | ₹19L | ₹54L |
| Proposed (Cloud+CDP) | ₹12L* | ₹10L | ₹10L | ₹32L |

*Year 1 includes one-time migration costs (~₹2L)

**3-Year Savings: ₹22L**

---

## 5. CDP Vendor Comparison

| Criteria | CleverTap | MoEngage | WebEngage |
|----------|-----------|----------|-----------|
| **Pricing (2-5K MAU)** | ₹2-3L/yr | ₹2.5-4L/yr | ₹1.5-2.5L/yr |
| **Wealth-specific features** | Good | Good | Basic |
| **Indian support** | Excellent | Excellent | Good |
| **API flexibility** | High | High | Medium |
| **Journey builder** | Advanced | Advanced | Basic |
| **Recommendation** | ⭐ Primary | Alternative | Budget option |

---

## 6. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data migration errors | Medium | High | Parallel run, reconciliation scripts |
| CDP integration delays | Low | Medium | Phased rollout, manual backup |
| LeadSquared API limits | Low | Low | Batch sync, caching layer |
| User adoption (CDP) | Medium | Medium | Training, gradual journey rollout |

---

## 7. Success Metrics

### Technical KPIs
- [ ] Oracle decommissioned by Week 4
- [ ] Zero data loss during migration
- [ ] <100ms sync latency (Cloud ↔ CDP)
- [ ] 99.9% uptime for edge functions

### Business KPIs (6-month targets)
- [ ] Client engagement score: +25%
- [ ] Dormant client reactivation: 15%
- [ ] SIP default rate: -20%
- [ ] Advisor efficiency: +30% (reduced manual follow-ups)

---

## 8. Immediate Next Steps

| # | Action | Owner | Deadline |
|---|--------|-------|----------|
| 1 | Approve this document | Leadership | This week |
| 2 | Create holdings/transactions migrations | Dev | Week 1 |
| 3 | Begin Oracle data export | DevOps | Week 1 |
| 4 | Initiate CDP vendor discussions | Product | Week 1 |
| 5 | Configure LeadSquared webhook | Dev | Week 2 |

---

## Appendix A: Edge Function Specifications

### `leadsquared-sync`
- **Trigger:** Webhook from LeadSquared on lead status change
- **Action:** Upsert to `profiles` table, log to `lead_sync_cache`
- **Auth:** API key validation

### `cdp-event-push`
- **Trigger:** Database triggers on holdings/transactions/goals
- **Action:** POST to CDP events API
- **Batching:** 100 events or 5 seconds, whichever first

### `market-data`
- **Trigger:** Scheduled (daily EOD)
- **Action:** Fetch NAV/prices, update `holdings.current_value`
- **Source:** MFAPI / BSE API

---

## Appendix B: Approval Signatures

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| Tech Lead | | | |
| Finance | | | |
| Compliance | | | |

---

*Document Version: 1.0*  
*Last Updated: December 2024*
