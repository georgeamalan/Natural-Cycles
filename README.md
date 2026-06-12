# Natural Cycles — Onboarding Quiz

Angular onboarding quiz. Screens and routing come from `src/app/quiz/config/quiz.config.ts` — swap
that file to change the quiz.

## Run it

Node 22+ and npm 10+.

```bash
npm install
npm start
```

Open http://localhost:4200

**Live demo:** https://georgeamalan.github.io/Natural-Cycles/

## How it works

- **Advanced** → 2 questions → summary
- **Beginner / intermediate** → quote → interests → follow-up
- Multiple interests: Design beats Development beats Strategy
- **Back** clears answers after that step
- Progress is saved in the browser (`nc-onboarding-quiz-state` in localStorage)

Useful paths: `quiz.config.ts` (content), `quiz-engine.ts` (routing), `quiz-state.service.ts`
(state), `labels.en.ts` (copy).

## Submit

Set `webhookUrl` in `src/environments/environment.ts` to your [webhook.site](https://webhook.site)
inbox. Answers are POSTed on submit.

## Production improvements

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) — what I would change before shipping this in a real app.
