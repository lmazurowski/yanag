module.exports = {
  packageJson: (appName, srcDir) => ({
    name: appName,
    description: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      start: `nodemon --watch '${srcDir}/**/*.ts' --exec ts-node ${srcDir}/index.ts`,
      build: 'tsc -p',
      test: `jest`,
      "test:watch": `jest --watch`,
      "test:cov": `jest --coverage`,
    },
    jest: {
      moduleFileExtensions: [
        `js`,
        `json`,
        `ts`
      ],
      rootDir: srcDir,
      testRegex: `.spec.ts$`,
      transform: {
        "^.+\\.(t|j)s$": `ts-jest`
      },
      collectCoverageFrom: [
        `**/*.(t|j)s`
      ],
      coverageDirectory: `../coverage`,
      testEnvironment: `node`
    }
  }),
  tsconfig: (srcDir) => ({
    compilerOptions: {
      target: 'es6',
      module: 'commonjs',
      outDir: 'dist',
      sourceMap: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      removeComments: true,
      baseUrl: '/',
      incremental: true
    },
    include: [
      `${srcDir}/**/*.ts`
    ],
    exclude: [
      'node_modules', 'dist'
    ]
  }),
  tslint: () => ({
    defaultSeverity: 'error',
    extends: 'tslint-config-airbnb'
  }),
  prettierrc: () => ({
    singleQuote: true,
    trailingComma: "all"
  })
};
