/**
 * @param {import('plop').NodePlopAPI} plop
 * @returns {import('plop').PlopGeneratorConfig}
 */
export const featureGenerator = (plop) => ({
  description: 'Generate a new feature',

  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'Feature name?',
      validate: (value) => {
        if (!value) {
          return 'Feature name is required';
        }
        return true;
      },
    },
  ],

  actions: [
    {
      type: 'addFolder',
      data: {
        base: '{{name}}',
        path: [
          'adapter/primary',
          'adapter/secondary',
          'application/usecase',
          'application/service',
          'domain/port',
          'domain/error',
          'domain/model',
        ]
      },
    }
  ],
})
