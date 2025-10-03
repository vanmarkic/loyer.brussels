# Development Documentation

This directory contains technical documentation for developers working on the loyer.brussels project.

## Recent Updates

### Apartment Size Acceleration Feature (2024)

Failing tests have been added for an acceleration feature in the apartment size adjustment controls:

- **📋 Specification**: [`apartment-size-acceleration-spec.md`](./apartment-size-acceleration-spec.md)
  - Complete feature specification
  - Three-phase acceleration model (150ms → 100ms → 50ms)
  - Implementation guidelines

- **📊 Test Summary**: [`test-implementation-summary.md`](./test-implementation-summary.md)
  - Test implementation details
  - Verification results
  - Next steps for implementation

**Status**: 
- ✅ Failing tests implemented (2 unit tests, 2 E2E tests)
- ✅ Documentation complete
- ⏳ Feature implementation pending

## Core Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture overview
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Testing strategies and guidelines
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment procedures
- **[DATA_REDUNDANCY_TESTING.md](./DATA_REDUNDANCY_TESTING.md)** - Data validation testing
- **[FINAL_E2E_TEST_RESULTS.md](./FINAL_E2E_TEST_RESULTS.md)** - E2E test results

## Quick Links

- Main README: [`../README.md`](../README.md)
- Quick Start: [`../QUICK_START.md`](../QUICK_START.md)
- Environment Setup: [`../SETUP_ENV.md`](../SETUP_ENV.md)
