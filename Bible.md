# Bible — правила разработки Simple4U (tutor-app)

Внутренний справочник команды. Следуй этим правилам при любых изменениях в репозитории.

---

## Git-ветки и CI/CD

**Все изменения сначала проходят через ветку `dev`. Только после проверки на dev-окружении допускается мерж в `master` (или `main`).**

### Порядок работы

1. **Разработка** — создавай feature-ветку от `dev` или коммить напрямую в `dev` (по договорённости в команде).
2. **Push в `dev`** — GitHub Actions автоматически собирает и деплоит dev-сборку на GitHub Pages.
3. **Проверка** — убедись, что функциональность работает на dev-окружении.
4. **Мерж в `master`** — только после успешной проверки на dev. Push в `master` запускает production-деплой.

### CI/CD (GitHub Actions)

| Ветка | Workflow | Триггер | Назначение |
|-------|----------|---------|------------|
| `dev`, `master` | `.github/workflows/ci.yml` | pull request и push | Unit-тесты (`npm test`) + сборка (`npm run build:dev`) |
| `dev` | `.github/workflows/deploy-dev.yml` | push в `dev` | Dev-деплой → https://wrincied.github.io/tutor-app/dev |
| `master` | `.github/workflows/deploy-prod.yml` | push в `master` | Prod-деплой → https://wrincied.github.io/tutor-app |

### Обязательные проверки перед мержем PR

В GitHub: **Settings → Branches → Branch protection rules** для `dev` и `master`:

1. Включи **Require a pull request before merging**
2. Включи **Require status checks to pass before merging**
3. Выбери check **`Test & Build`** (job из `ci.yml`)
4. (Рекомендуется) **Require branches to be up to date before merging**

Без этих настроек workflow запустится, но мерж PR не будет заблокирован при падении тестов.

### Запрещено

- Пушить непроверенные изменения напрямую в `master` / `main`, минуя `dev`.
- Мержить в `master` без предварительного деплоя и проверки на dev.

### Репозиторий

- GitHub: https://github.com/wrincied/tutor-app
- Основная production-ветка: `master`
- Dev-ветка: `dev`

---

*Обновляй этот документ при изменении процессов деплоя или ветвления.*
