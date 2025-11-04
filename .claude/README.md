# Claude Code Configuration - Loyer Brussels

This directory contains Claude Code configuration with **Superpowers** and **UX UI Skills** for the Loyer Brussels project.

## Quick Start

Use any of the slash commands below to leverage Claude's specialized capabilities:

```bash
# Example usage
/ui-review components/ui/button.tsx
/refactor app/actions/calculate-rent.ts
/test components/StepForm.tsx
```

## Superpowers Commands

These commands give Claude enhanced capabilities for code quality and development:

### `/refactor`
Intelligently refactor code following best practices:
- DRY and SOLID principles
- TypeScript best practices
- React hooks optimization
- Improved readability and maintainability

### `/optimize`
Performance optimization expert:
- Identify bottlenecks
- React re-render optimization
- Bundle size reduction
- Next.js Server/Client component optimization
- Core Web Vitals improvements

### `/debug`
Advanced debugging assistance:
- Root cause analysis
- Stack trace interpretation
- Solution implementation
- Regression prevention

### `/test`
Generate comprehensive tests:
- Unit tests (Vitest)
- Integration tests
- E2E tests (Playwright)
- Component tests (@testing-library/react)
- Accessibility testing

### `/security`
Security audit and vulnerability check:
- Common vulnerabilities (XSS, CSRF, etc.)
- Next.js API security
- Dependency vulnerabilities
- Best practices implementation

### `/architecture`
Project architecture analysis:
- Structure review
- Design pattern recommendations
- Scalability improvements
- Documentation generation

### `/pr`
Create comprehensive pull request:
- Run all checks (tests, lint, typecheck, build)
- Generate PR description
- Quality assurance
- Create PR with git

## UX UI Skills Commands

Specialized commands for UI/UX excellence:

### `/ui-review`
Comprehensive UI/UX review:
- Visual design analysis
- User experience evaluation
- Accessibility check
- Responsive design review
- Actionable recommendations

### `/component`
Create production-ready components:
- TypeScript + React best practices
- Radix UI integration
- Tailwind CSS styling
- Accessibility built-in
- Dark mode support
- Full testing

### `/accessibility`
Accessibility audit and fixes:
- WCAG 2.1 Level AA compliance
- ARIA attributes
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- Focus management

### `/responsive`
Responsive design optimization:
- Mobile-first check
- Breakpoint consistency
- Touch target sizing
- Layout issue identification
- Cross-device testing

### `/design-system`
Design system consistency:
- Component inventory
- Design token review
- Pattern consolidation
- Radix UI integration check
- Documentation

### `/i18n`
Internationalization review:
- next-intl best practices
- Missing translations
- Hardcoded string detection
- Format handling (dates, numbers)
- French/Dutch support

### `/ux-improve`
UX improvement suggestions:
- User journey analysis
- Friction point identification
- Psychology-based recommendations
- Form flow optimization
- Prioritized action items

### `/animation`
Add delightful animations:
- Smooth transitions
- Micro-interactions
- Loading states
- Performance optimization
- Accessibility (prefers-reduced-motion)

### `/forms`
Form UX optimization:
- react-hook-form best practices
- Smart validation
- Mobile optimization
- Accessibility
- Multi-step forms

## Project Context

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Forms**: react-hook-form
- **i18n**: next-intl (French/Dutch)
- **Database**: Supabase
- **Testing**: Vitest + Playwright

### Key Priorities
1. User experience and accessibility
2. Type safety and code quality
3. Performance and Core Web Vitals
4. Mobile-first responsive design
5. Internationalization (FR/NL)
6. Test coverage
7. Design system consistency

## Usage Examples

### Refactoring a Component
```bash
/refactor components/ui/card.tsx
```
Claude will analyze the component and suggest/implement improvements following best practices.

### UI/UX Review
```bash
/ui-review app/steps/property-info/page.tsx
```
Get comprehensive UX feedback with actionable recommendations.

### Creating a New Component
```bash
/component
```
Tell Claude what component you need, and it will create a production-ready, accessible component with tests.

### Performance Optimization
```bash
/optimize app/layout.tsx
```
Claude will analyze and optimize for performance, considering Server/Client Components, bundle size, and more.

### Accessibility Audit
```bash
/accessibility components/StepForm.tsx
```
Get a detailed accessibility report with fixes.

## Tips

1. **Be Specific**: Provide file paths or describe what you want to work on
2. **Combine Commands**: Use multiple commands in sequence for comprehensive work
3. **Context Matters**: Claude has access to your entire codebase
4. **Ask Questions**: If unsure which command to use, just ask!

## Customization

You can modify any command in `.claude/commands/` to better fit your needs. Each command is a markdown file with a description and instructions.

## Learn More

- [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code)
- [Project Documentation](../docs/)

---

**Superpowers activated! Happy coding!** 🚀
