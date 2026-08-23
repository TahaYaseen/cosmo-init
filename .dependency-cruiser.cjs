/**
 * Architecture enforcement (development-plan.md §2.4 Dependency Direction).
 *
 * Rules encoded:
 *  - components/ui/** may not import from components/products/** or components/layout/**
 *    (it is the lowest layer).
 *  - components/layout/** may import from components/ui/** only (not products/**).
 *  - No components/** file may import from app/** (no upward dependency).
 *  - Only app/** and lib/** may import payload.config.ts directly (Data Access
 *    pattern — Local API only from Server Components/Route Handlers).
 */
module.exports = {
  forbidden: [
    {
      name: 'ui-no-upward-to-products-or-layout',
      severity: 'error',
      comment:
        'components/ui/** is the lowest layer — it must not import from components/products/** or components/layout/**.',
      from: { path: '^src/components/ui' },
      to: { path: '^src/components/(products|layout)' },
    },
    {
      name: 'layout-no-import-products',
      severity: 'error',
      comment: 'components/layout/** may only import from components/ui/**, not components/products/**.',
      from: { path: '^src/components/layout' },
      to: { path: '^src/components/products' },
    },
    {
      name: 'components-no-upward-to-app',
      severity: 'error',
      comment: 'No components/** file may import from app/** (no upward dependency).',
      from: { path: '^src/components' },
      to: { path: '^src/app' },
    },
    {
      name: 'only-app-and-lib-import-payload-config',
      severity: 'error',
      comment:
        'Only Server Components/Route Handlers (app/**) and lib/** may import payload.config.ts directly (Data Access pattern).',
      from: { pathNot: '^src/(app|lib)' },
      to: { path: 'payload\\.config' },
    },
  ],
  options: {
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
    exclude: {
      path: 'node_modules|\\.test\\.|\\.next|test-utils',
    },
  },
};
