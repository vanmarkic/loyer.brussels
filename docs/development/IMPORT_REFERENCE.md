# Quick Reference: New Import Paths

## Calculator Feature Imports

### Context
```typescript
// Global form state
import { useGlobalForm } from '@/features/calculator/context/global-form-context';

// Legacy form context (if needed)
import { useForm } from '@/features/calculator/context/form-context';
```

### Components
```typescript
// Step components
import { PropertyTypeStep } from '@/features/calculator/components/property-type-step';
import { PropertyDetailsStep } from '@/features/calculator/components/property-details-step';
import { FeaturesStep } from '@/features/calculator/components/features-step';
import { EnergyStep } from '@/features/calculator/components/energy-step';
import { AddressStep } from '@/features/calculator/components/address-step';
import { ResultStep } from '@/features/calculator/components/result-step';

// Calculator wrapper
import { Calculator } from '@/features/calculator/components/calculator';

// Step wrapper
import { StepWrapper } from '@/features/calculator/components/step-wrapper';
```

### Hooks
```typescript
// Step navigation
import { useStepNavigation } from '@/features/calculator/hooks/use-step-navigation';

// Hold to increment
import { useHoldRepeat } from '@/features/calculator/hooks/use-hold-repeat';
```

### Actions (Server Actions)
```typescript
// Fetch difficulty index
import { fetchDifficultyIndex } from '@/features/calculator/actions/fetch-difficulty-index';

// Search addresses
import { searchAddresses } from '@/features/calculator/actions/search-addresses';
```

### Types
```typescript
// Global form types
import type { GlobalFormState } from '@/features/calculator/types/global-form-types';
```

### Utilities
```typescript
// PDF generation
import { handlePDF, propertyTypeLabels } from '@/features/calculator/lib/utils';

// Rent calculation
import { calculateRent } from '@/features/calculator/lib/rent-calculator';

// Address parsing
import { parseQuery } from '@/features/calculator/lib/address/parse-query';
```

---

## Shared Imports

### UI Components
```typescript
// shadcn/ui components (consolidated)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedProgress } from '@/components/ui/enhanced-progress';
```

### Shared Components
```typescript
// Language switcher
import LanguageSwitcher from '@/app/components/language-switcher';

// Layouts
import { UnifiedCalculatorLayout } from '@/app/components/layouts/unified-calculator-layout';
```

### Shared Hooks
```typescript
// Debounce
import { useDebounce } from '@/app/hooks/use-debounce';

// Enhanced navigation
import { useEnhancedNavigation } from '@/app/hooks/use-enhanced-navigation';
```

### i18n
```typescript
// Navigation
import { useRouter, usePathname, Link } from '@/app/i18n/navigation';

// Locales
import { locales, defaultLocale } from '@/app/i18n/request';

// Translations
import { useTranslations } from 'next-intl';
```

### Data Layer
```typescript
// Repositories
import { rentRecordRepository } from '@/app/data/repositories';

// Types
import type { RentRecordInput, UserInputs } from '@/app/data/types';
```

### Utilities
```typescript
// Shared utilities (cn only)
import { cn } from '@/app/lib/utils';

// Email
import { sendEmail } from '@/app/lib/email';

// Supabase
import { supabase } from '@/app/lib/supabase';
```

---

## Common Patterns

### Calculator Step Component
```typescript
'use client';

import { useGlobalForm } from '@/features/calculator/context/global-form-context';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyStep() {
  const { state, dispatch } = useGlobalForm();
  const t = useTranslations('MyStep');
  
  // Component logic
}
```

### Using Calculator Utilities
```typescript
import { handlePDF } from '@/features/calculator/lib/utils';
import { calculateRent } from '@/features/calculator/lib/rent-calculator';

// Generate PDF
const downloadPdf = handlePDF(state);
downloadPdf();

// Calculate rent
const result = calculateRent(userInputs, difficultyIndex);
```

### Server Actions
```typescript
'use server';

import { fetchDifficultyIndex } from '@/features/calculator/actions/fetch-difficulty-index';

export async function MyAction() {
  const index = await fetchDifficultyIndex(postalCode);
  return index;
}
```

---

## Deprecated Paths (Don't Use)

```typescript
// ❌ OLD - Don't use these anymore
import { useGlobalForm } from '@/app/context/global-form-context';
import { PropertyTypeStep } from '@/app/components/rental-calculator/property-type-step';
import { useStepNavigation } from '@/app/hooks/use-step-navigation';
import { fetchDifficultyIndex } from '@/app/actions/fetch-difficulty-index';
import { cn } from '@/lib/utils';
import { locales } from '@/src/i18n/request';

// ✅ NEW - Use these instead
import { useGlobalForm } from '@/features/calculator/context/global-form-context';
import { PropertyTypeStep } from '@/features/calculator/components/property-type-step';
import { useStepNavigation } from '@/features/calculator/hooks/use-step-navigation';
import { fetchDifficultyIndex } from '@/features/calculator/actions/fetch-difficulty-index';
import { cn } from '@/app/lib/utils';
import { locales } from '@/app/i18n/request';
```

---

## tsconfig.json Paths

The following path mappings are configured:

```json
{
  "@/*": ["./*"],                    // Root workspace
  "@/features/*": ["./app/features/*"],   // Feature modules
  "@/components/*": ["./components/*"],    // Shared components
  "@/app/*": ["./app/*"]                  // App directory
}
```

---

## File Locations

| What | Where |
|------|-------|
| Calculator step components | `app/features/calculator/components/` |
| Calculator context | `app/features/calculator/context/` |
| Calculator hooks | `app/features/calculator/hooks/` |
| Calculator actions | `app/features/calculator/actions/` |
| Calculator utilities | `app/features/calculator/lib/` |
| Calculator types | `app/features/calculator/types/` |
| Shared UI components | `components/ui/` |
| Shared app components | `app/components/` |
| Shared hooks | `app/hooks/` |
| i18n configuration | `app/i18n/` |
| Data repositories | `app/data/repositories/` |
| Data types | `app/data/types.ts` |
| Shared utilities | `app/lib/utils.ts` |
| Email utilities | `app/lib/email.ts` |
| Supabase config | `app/lib/supabase.ts` |

---

## Migration Checklist

When updating old code:

- [ ] Replace `@/app/context/global-form-context` → `@/features/calculator/context/global-form-context`
- [ ] Replace `@/app/components/rental-calculator/*` → `@/features/calculator/components/*`
- [ ] Replace `@/app/hooks/use-step-navigation` → `@/features/calculator/hooks/use-step-navigation`
- [ ] Replace `@/app/hooks/use-hold-repeat` → `@/features/calculator/hooks/use-hold-repeat`
- [ ] Replace `@/lib/utils` → `@/app/lib/utils` (for shared utilities)
- [ ] Replace `@/lib/utils` → `@/features/calculator/lib/utils` (for PDF/calculator utils)
- [ ] Replace `@/src/i18n/*` → `@/app/i18n/*`
- [ ] Replace relative imports like `../../../../context/` → absolute paths

---

**Last Updated**: 2025-10-03  
**Version**: Post-refactor
