# What I would improve before production

## What I am happy with

The quiz content and routing live in config (`quiz.config.ts` + `quiz-engine.ts`), so adding
questions or tracks is mostly a data change. State, persistence, and screen components are separated.
Core logic has unit tests. There is basic accessibility work (keyboard, ARIA, skip link).

That is enough for a case study. A real app would need more around submission, data, and monitoring.

## Must fix before shipping

**Submit flow.** Answers go to webhook.site with `no-cors`. The app cannot tell if the request
actually succeeded — a failed network call can still look like success. I would use our own API that
returns a normal HTTP response, show real errors, and support retry. API URLs should come from env
vars, not committed source files.

**Privacy.** Answers sit in plain `localStorage`. For a health app I would clear client data after
submit where possible, keep sensitive fields on the server, and make sure we meet GDPR and any
health-data rules.

**Analytics and errors.** There is no tracking of where users drop off, and errors only go to
`console.error`. I would add step-level events and something like Sentry for production errors.

**Tests and CI.** Engine and state are well tested, but there are no E2E tests and no CI pipeline on
GitHub — only local git hooks. I would add Playwright for both quiz paths and run lint + tests on
every PR.

## Smaller fixes worth doing

- Prune stored answers when the user taps Back, not only when they re-answer.
- English only today — Natural Cycles needs multiple languages.
- Support browser back/forward, or at least document that only in-app Back works.

## If the quiz gets much bigger

More questions and expertise tracks do not require a rewrite. The config-driven engine can grow for a
while. I would add things step by step:

1. **CMS** — let content people edit questions without a code deploy.
2. **New question types** — sliders, dates, etc. via a small plugin registry instead of new
   components every time.
3. **Domain split (only when needed)** — if tracks become very different (separate legal copy,
   rules, and outcomes), split quiz flow, profile/recommendations, and submission into clearer
   modules. Full DDD only makes sense if multiple teams own those areas — not just because there
   are more questions.
