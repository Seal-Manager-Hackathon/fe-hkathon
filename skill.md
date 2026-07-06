---
name: design-system-devpost
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Devpost

## Mission
Deliver implementation-ready design-system guidance for Devpost that can be applied consistently across e-commerce storefront interfaces.

## Brand
- Product/brand: Devpost
- URL: https://devpost.com/
- Audience: online shoppers and consumers
- Product surface: e-commerce storefront

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=Circular`, `font.family.stack=Circular, Helvetica Neue, Helvetica, Arial, sans-serif`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=16px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=14px`, `font.size.md=16px`, `font.size.lg=18px`, `font.size.xl=20px`, `font.size.2xl=24px`, `font.size.3xl=30px`, `font.size.4xl=36px`
- Color palette: `color.text.primary=#233136`, `color.text.secondary=#192325`, `color.text.tertiary=#1f78d1`, `color.text.inverse=#003e54`, `color.surface.base=#000000`, `color.surface.muted=#ffffff`, `color.surface.strong=#243036`
- Spacing scale: `space.1=8px`, `space.2=9px`, `space.3=10px`, `space.4=12px`, `space.5=14px`, `space.6=14.4px`, `space.7=16px`, `space.8=16.31px`
- Radius/shadow/motion tokens: `radius.xs=2px`, `radius.sm=3px` | `shadow.1=rgba(0, 0, 0, 0.3) 0px 1px 3px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=300ms`, `motion.duration.slow=500ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
