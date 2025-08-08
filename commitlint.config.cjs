module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Relax rules to reduce friction during development
  rules: {
    'type-enum': [0],
    'type-empty': [0],
    'scope-case': [0],
    'scope-empty': [0],
    'subject-case': [0],
    'subject-empty': [0],
    'header-max-length': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
