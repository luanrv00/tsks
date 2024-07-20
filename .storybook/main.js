/** @type { import('@storybook/nextjs').StorybookConfig } */
const config = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async config => {
    config.resolve = config.resolve || {}
    config.resolve.modules = config.resolve.modules || []
    config.resolve.alias = {
      ...config.resolve.alias,
      'next/dist/shared/lib/router-context.shared-runtime':
        'next/dist/shared/lib/router-context',
      'next/dist/shared/lib/head-manager-context.shared-runtime':
        'next/dist/shared/lib/head-manager-context',
      'next/dist/shared/lib/app-router-context.shared-runtime':
        'next/dist/shared/lib/app-router-context',
      'next/dist/shared/lib/hooks-client-context.shared-runtime':
        'next/dist/shared/lib/hooks-client-context',
    }
    return config
  },
}
export default config
