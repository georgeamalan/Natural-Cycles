# What I would improve before production

The quiz works for this case study. Below is what I would change before shipping it in a real app.

## Submit

Answers are POSTed to webhook.site with `no-cors` (`submission.service.ts`). The app cannot read the
response, so a failed request can still look like success. I would use our own API with normal error
handling and retry. The webhook URL is in `environment.ts` and `environment.prod.ts` — it should
come from build-time env vars instead.

## Data and privacy

Quiz state is stored in plain `localStorage` (`nc-onboarding-quiz-state`). For a health app I would
clear client data after submit where it makes sense, keep sensitive fields on the server, and handle
GDPR and health-data rules properly.

## Monitoring

There is no funnel analytics. `GlobalErrorHandler` only logs to the console — nothing is sent to an
error reporting service.

## Testing and CI

There are 53 unit tests across the engine, state, persistence, and config validator. There are no
component or E2E tests.

CI runs on push to `main` via GitHub Actions (typecheck, lint, format check, tests, build, deploy).
Local git hooks also run tests and build before push. Nothing runs on pull requests unless you push
to `main`. I would add Playwright for both quiz paths and CI on every PR.

## Smaller gaps

- Tapping Back does not prune stored answers — that only happens when you change an answer on an
  earlier screen.
- English only (`labels.en.ts`).
- Only the in-app Back button works — not the browser back button.

## If the quiz grows

The config-driven engine can handle more questions without a rewrite. Longer term I would consider a
CMS for content, a plugin registry for new question types, and splitting into separate modules only
if tracks become very different (legal copy, rules, outcomes).
