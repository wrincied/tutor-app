## Summary

- Unify CI into a single workflow: tests always run, gh-pages deploys **only from `dev`**
- Remove separate `deploy-dev.yml` and `deploy-prod.yml` (master no longer deploys)
- Update `Bible.md` with the three-branch model: `dev` → `gh-pages`, `master` via PR only

## Context

PR #2 merged partial CI work but missed commit `abc4bee`. As a result:
- `Deploy Prod to GitHub Pages` still ran on `master` push
- `/dev` on gh-pages returned 404 (deploy went to root from master)

This PR completes the agreed workflow.

## Changes

| File | Change |
|------|--------|
| `.github/workflows/ci.yml` | Add `Deploy to GitHub Pages` job (needs `Test & Build`); remove `push` trigger on `master` |
| `.github/workflows/deploy-dev.yml` | **Deleted** — merged into `ci.yml` |
| `.github/workflows/deploy-prod.yml` | **Deleted** — master must not deploy |
| `Bible.md` | Document dev / master / gh-pages flow and branch rulesets |

## Expected behavior after merge

```
PR → dev        → Test & Build ✅
merge → dev     → Test & Build ✅ → Deploy to GitHub Pages ✅ → gh-pages/dev
PR → master     → Test & Build ✅ (no deploy)
merge → master  → no workflow, no deploy
```

## Linear

SOM-66 — Configure Simple4U tutor-app CI/CD pipeline and branch workflow

## Test plan

- [x] `npm test` — 36/36 passed locally
- [x] `npm run build:dev` — passes locally
- [x] `ng build --configuration=production --base-href=/tutor-app/dev/` — passes locally
- [ ] CI **Test & Build** green on this PR
- [ ] After merge: push to `dev` triggers deploy job
- [ ] https://wrincied.github.io/tutor-app/dev/ serves the app
- [ ] Branch rulesets: `Test & Build` required on `dev` and `master`
