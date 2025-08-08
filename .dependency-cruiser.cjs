/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    combinedDependencies: true,
    includeOnly: '^src',
    reporters: [{ reporter: 'err' }, { reporter: 'dot' }],
  },
  forbidden: [
    // disallow circular dependencies
    { name: 'no-circular', severity: 'warn', from: {}, to: { circular: true } },
    // disallow orphan modules
    { name: 'no-orphans', severity: 'warn', from: { orphan: true }, to: {} },
    // prefer ts/tsx in src
    {
      name: 'no-js-in-src',
      severity: 'warn',
      from: { path: '^src' },
      to: { path: '\\.(js|jsx)$' },
    },
  ],
};
