import nextEslintPluginNext from '@next/eslint-plugin-next';
import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.base.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: { '@next/next': nextEslintPluginNext },
    rules: { ...nextEslintPluginNext.configs.recommended.rules },
  },
  {
    ignores: ['.next/**/*', '**/out-tsc'],
  },
];
