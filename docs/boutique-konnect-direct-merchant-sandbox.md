# Dalil Tounes Boutique — Konnect direct-to-merchant (sandbox preparation)

## Scope and current status
This is a **preparation only**. No new checkout button, API call, order activation, payment collection, payment status update, merchant account linkage or production migration is enabled by this branch. The existing Stripe site checkout sells **Dalil Tounes offers** in EUR; it must not be reused for TND customer orders.

## Reuse of existing components
- Retain `BoutiqueInteractive` to create a server-acknowledged customer request.
- Retain `BoutiqueCustomerOrders` for the verified amount, pending balance and payment states.
- Reuse Konnect conceptual UI button (`KonnectButton`) **only after** a secured order-specific server endpoint exists. Never let UI supply payee wallet, payment amount or "paid" status.
- Reuse the existing Supabase merchant authorization (`professional_profile_access`) and private order storage.

## Direct settlement: one merchant, one wallet
Each participating merchant must complete Konnect merchant identity verification and link **their own** wallet. The merchant's wallet, not Dalil Tounes', must be submitted to `receiverWalletId`. Provider API keys must be managed using a credential vault that is inaccessible to the browser, not `entreprise`, Airtable, or public tables. Store a **reference** to the vault secret on the merchant account. All accounts disabled until the receiving wallet ownership and production credential scope are verified. **Ask Konnect to confirm whether a multi-merchant platform is allowed to initiate transactions with a merchant-owned credential and wallet**; do not infer platform-level authorization merely from `receiverWalletId`.

## Future server flow — do not activate yet
1. Client creates an idempotent order. Merchant account is approved and order belongs to it.
2. Merchant config chooses whether an upfront deposit applies and its amount; server validates `0 < deposit < total`. Otherwise pay full total. No cash-on-delivery.
3. Server obtains `receiverWalletId` and merchant credential from private configuration; computes amount from authoritative order in **integer TND millimes**.
4. Server creates Konnect payment using `POST /payments/init-payment`, with `x-api-key`, `receiverWalletId`, `token: TND`, `type: immediate`, `amount` (millimes), `orderId` and a registered webhook. Persist payment reference and expected amount **before exposing payUrl**; handle duplicate calls idempotently.
5. A webhook is **only a signal to reconcile**. Query Konnect `GET /payments/:paymentId` from backend and verify identity, payment ID, expected order, receiving wallet, token, status `completed` and exact reached amount. Verify provider responses with sandbox recordings before accepting. Never trust a return URL, webhook query parameters, user text or merchant self-assertion.
6. Persist verified payment evidence in a locked-down attempt ledger. Atomically reconcile aggregate paid amount and payment status for deposit/full/balance. Do not overwrite prior evidence; protect against repeat webhook and competing attempts. Existing order-confirmed state requires verified deposit or full payment, and completion requires full verification.
7. On a fully validated response: client sees payment confirmation; merchant sees the verified amount and balance in `Mes commandes`. On failure or pending: show unconfirmed state, do not confirm sale.

## Technical gates before any public orders
- Dedicated authenticated merchant onboarding, strong ownership verification and safe credential vault with rotation/revocation.
- Separate Konnect sandbox wallets/API keys and **two distinct merchants** in the isolation tests.
- Confirmation from Konnect on multi-merchant API use and settlement to a distinct receiver wallet.
- Test cases: negative amount, client-controlled wallet, inaccurate amounts, EUR, unknown merchant, mismatched wallet/order, pending payment, double webhook, expired sessions, partial deposit then balance, concurrent retries, refund handling.
- Server-only environment flag stays disabled for real orders: `DALIL_BOUTIQUE_ORDERS_ENABLED` must not be switched to `true` on this task.
- No Stripe price IDs or site subscriber checkout should be reused.

## Official API references
- https://docs.konnect.network/docs/fr/overview/environments
- https://docs.konnect.network/docs/fr/api-integration/endpoints/initiate-payment
- https://docs.konnect.network/docs/fr/api-integration/endpoints/get-payment-details

## Versioning
This branch follows PR #305 / Dalil independent PWA. Do not edit QR, auth, branding, Lienora France, or Lienora World.
