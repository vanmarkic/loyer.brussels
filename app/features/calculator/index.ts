// Calculator Feature Barrel Export
// Centralized exports for the calculator feature module

// Components
export * from './components/property-type-step';
export * from './components/property-details-step';
export * from './components/features-step';
export * from './components/energy-step';
export * from './components/address-step';
export * from './components/result-step';
export * from './components/calculator';

// Context
export {
  GlobalFormContext,
  GlobalFormProvider,
  useGlobalForm,
  initialGlobalState,
  globalFormReducer
} from './context/global-form-context';
export { FormProvider, useForm, type FormState } from './context/form-context';

// Hooks
export * from './hooks/use-step-navigation';
export * from './hooks/use-hold-repeat';

// Actions
export * from './actions/fetch-difficulty-index';
export * from './actions/search-addresses';

// Types
export * from './types/global-form-types';
