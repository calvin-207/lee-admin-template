# Frontend visual refresh (proposed)

This PR introduces a restrained visual polish of the existing Lee Admin Template. It intentionally preserves routes, menu data, API contracts, permissions, branding settings, and the user's selectable primary color.

## What changed

- New `polish.scss` layer with reusable radii, spacing, neutral surface and type tokens.
- Navigation/header, side menu, cards, tables, forms and mobile spacing made more consistent.
- Restored visible keyboard-focus indications after legacy global `outline: none` rules.
- Updated tab bar density and active styles; desktop tabs can now be navigated using Enter/Space.
- Dashboard introduces clear visual hierarchy and explicitly labels existing hard-coded figures as **demo data**.
- Dashboard ECharts instances and resize event listeners are disposed on unmount.
- Tabs click listener cleaned up on unmount.
- Respects Element Plus light/dark variables and `prefers-reduced-motion`.

## Validation checklist before merging

Run from `frontend/`:

```bash
npm ci
npm run build
npm test -- --run
```

If the package does not expose `test`, use the corresponding Vitest script defined by `package.json`.

Manual walkthrough:
1. Desktop (1440px): default, top-header and split navigation layouts.
2. Mobile (390px, 768px): menu drawer, responsive tables, forms and tab dropdown.
3. Light/dark modes, custom primary colors, collapsed/expanded sidebar.
4. Keyboard Tab/Enter/Space focus navigation.
5. Dashboard navigation, browser back/forward, chart resizing, route mount/unmount.
6. Screenshot comparison with original `main` before approving.

**Current verification:** source review and GitHub commit integrity only. A production browser visual QA/build was not executed from the connector environment.

## Future iterations

- Adopt reusable `PageHeader`, `FilterBar`, `DataTableToolbar` patterns.
- Replace dashboard placeholder KPIs with real metrics after API contracts are defined.
- Audit form labels, loading states, table empty states, responsive overflow, WCAG contrast.
- Introduce screenshot-based regression testing for the three layout modes.
