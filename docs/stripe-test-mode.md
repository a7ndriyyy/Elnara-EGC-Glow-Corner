# ELNARA Stripe deposits — test-mode preparation

This branch is **not deployed**. The payment flow must be tested against a dedicated Supabase test project and Stripe test keys before any production use.

## Safety rules

- Do not use the existing production Supabase project for this first integration test.
- Do not apply the migration to production.
- The Checkout function rejects Stripe secret keys that do not start with `sk_test_`; the status endpoint only accepts `cs_test_` Checkout Session IDs.
- Never add Stripe keys, webhook secrets, or Supabase service-role keys to Git, frontend `VITE_*` variables, or chat messages.
- A booking is created only by the signed Stripe webhook after the server verifies the paid Checkout Session and checks its amount/currency against the private hold.
- The frontend success redirect is not proof of payment; it polls the server-side payment status.
- Deposit percentage is intentionally configurable. Agree the percentage before setting `STRIPE_DEPOSIT_PERCENT`.

## Required test-project setup

1. Create a separate Supabase project for testing. Use test/fake customer data only.
2. Configure the same schema and required existing booking functions in that test project. Review the new migration against its actual schema before applying it.
3. Create a Stripe account and use only **test mode** API keys.
4. Set the new Edge Function secrets in the test Supabase project only:
   - `STRIPE_SECRET_KEY` — test secret key beginning with `sk_test_`
   - `STRIPE_WEBHOOK_SECRET` — signing secret for the test webhook endpoint
   - `PUBLIC_APP_URL` — local app origin or a dedicated preview URL, without a trailing slash or route fragment
   - `STRIPE_DEPOSIT_PERCENT` — agreed integer percentage from 1 to 100 (for example, 20 only if that policy is approved)
   - Existing test-project secrets also required by booking: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`
5. Configure the Stripe test webhook endpoint to the test project's `/functions/v1/stripe-webhook` URL. Subscribe to:
   - `checkout.session.completed`
   - `checkout.session.expired`
6. Set the frontend's `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_TURNSTILE_SITE_KEY` to the **test project** values in a local-only env file. Do not commit that file.
7. Deploy these functions to the test project only: `create-checkout-session`, `stripe-webhook`, and `booking-payment-status`. Also deploy the updated `create-appointment` function, which now rejects direct unpaid booking requests; otherwise an older deployed copy could bypass the deposit flow. Do not deploy any of these functions to production during this preparation.

## Test checklist

- Checkout is unavailable when Stripe secrets or the deposit percentage are missing.
- A non-test Stripe secret key is rejected.
- A client cannot set the deposit amount; it is calculated from the active service price and server-side percentage.
- Turnstile failure prevents checkout creation.
- A selected slot is held while checkout is active and expires/release after checkout expires.
- Two simultaneous attempts for overlapping times cannot both obtain a hold.
- Cancelled or expired checkout does not create an appointment.
- A forged webhook, stale signature, wrong amount, wrong currency, or mismatched session/hold is rejected.
- A valid signed test webhook creates exactly one appointment; duplicate webhook delivery is idempotent.
- The return URL alone never confirms an appointment.
- If payment succeeds but booking finalization fails, the webhook returns an error for Stripe retry and the customer sees an unresolved-payment message rather than being told the booking is confirmed.
- Test mobile layout and EN/FR/UK/RU translations.

## Current limitations to resolve before merge

- No Stripe account, test keys, webhook endpoint, or test Supabase project has been configured yet.
- The migration assumes the existing `services`, `business_hours`, `appointments`, and `blocked_periods` schema and the existing `create_appointment` RPC signature. Review these against the dedicated test database before applying the migration.
- Build, lint, SQL execution, webhook signature tests, and browser tests have not been run in this environment.
- Email confirmation and deposit/refund/cancellation policy are not included in this first integration.
