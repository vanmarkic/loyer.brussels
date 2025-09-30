# Quick Start: Screenshot Testing

## 🚀 Ready to Use!

Everything is set up and ready. Here's how to run your first screenshot test:

## 1. Start Development Server

```bash
yarn dev
```

## 2. Run Screenshot Tests (in new terminal)

```bash
# Run all screenshot tests
yarn test:screenshots

# OR run with interactive UI (recommended first time)
yarn test:e2e:ui
```

## 3. View Results

```bash
# Open HTML report
yarn test:report

# Screenshots are saved in:
# test-results/screenshots/desktop-chromium/
# test-results/screenshots/mobile-safari/
# test-results/screenshots/tablet/
```

## What Gets Captured?

✅ **28+ screenshots** across 3 devices (desktop, mobile, tablet)

### Journeys Covered:

1. **Homepage** (3 languages)
2. **Region Selection** (Brussels, Wallonie, Flandres)
3. **Tenant Calculator** (all steps)
4. **Landlord Pages**
5. **Wuune Info Pages**
6. **Campaign Pages**
7. **Contact Forms**
8. **Error States**

## Available Commands

```bash
yarn test:e2e          # Run all E2E tests
yarn test:e2e:ui       # Interactive UI mode 👍
yarn test:screenshots  # Desktop + mobile screenshots
yarn test:report       # View HTML report
```

## Next Steps

1. ✅ Run tests: `yarn test:screenshots`
2. 👀 Review screenshots in `test-results/screenshots/`
3. 📝 Read UX analysis: `UX_SCREENSHOT_ANALYSIS.md`
4. 🛠️ Implement fixes based on priority matrix
5. ♻️ Re-run tests to verify improvements

## Key Files

- **`playwright.config.ts`** - Test configuration
- **`tests/e2e/user-journeys.spec.ts`** - Test suite (28+ tests)
- **`UX_SCREENSHOT_ANALYSIS.md`** - Detailed UX findings
- **`tests/README.md`** - Complete testing guide

## Troubleshooting

**Tests won't start?**

```bash
# Make sure dev server is running
yarn dev

# In new terminal:
yarn test:screenshots
```

**Need to see what's happening?**

```bash
# Run in headed mode (opens browser)
yarn test:e2e --headed
```

**Browser issues?**

```bash
npx playwright install --force
```

## 💡 Pro Tips

- Use `yarn test:e2e:ui` for interactive debugging
- Screenshots auto-save with descriptive names
- Tests run on desktop, mobile, AND tablet
- Full UX analysis already documented

---

**Ready?** Run `yarn test:screenshots` now! 🎬
