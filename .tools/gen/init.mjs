import { existsSync } from 'node:fs'

/**
 * @param {import('plop').NodePlopAPI} plop
 * @returns {import('plop').PlopGeneratorConfig}
 */
export const initGenerator = (plop) => {
  plop.setHelper('getExtension', getExtension)

  return {
    description: 'Initialize the project',

    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Project name?',
        validate: (value) => {
          if (!value) {
            return 'Project name is required'
          }
          return true
        },
      },

      {
        type: 'list',
        name: 'language',
        message: 'Language?',
        choices: ['typescript', 'javascript', 'python', 'go', 'rust'],
      },

      {
        type: 'input',
        name: 'entrypoint',
        message: 'First entrypoint? (examples: apifastify, webreact)',
        default: 'main',
      }
    ],

    actions: [
      {
        skip: ({ language }) => language !== 'go' && 'Skipping go module initialization',
        type: 'run',
        data: { command: 'go mod init {{name}}' },
      },

      {
        skip: ({ language }) => (language !== 'typescript' && language !== 'javascript') && 'Skipping bun initialization',
        type: 'add',
        path: 'package.json',
        template: `{
  "name": "{{name}}",
  "module": "main.{{getExtension language}}",
  "type": "module",
  "devDependencies": {
    "@types/bun": "latest"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}`
      },

      {
        skip: ({ language }) => (language !== 'rust') && 'Skipping cargo initialization',
        type: 'run',
        data: { command: 'cargo init --bin' },
      },

      {
        skip: ({ language }) => (language !== 'python') && 'Skipping python venv initialization',
        type: 'run',
        data: { command: 'uv venv' },
      },

      {
        type: 'add',
        path: 'main.{{getExtension language}}',
        transform: (_, { language }) => getMainFileContent(language),
      },

      {
        type: 'addFolder',
        data: { path: ['common', 'entrypoint/{{entrypoint}}', 'tests'] },
      },

      {
        type: 'add',
        path: 'README.md',
        template: '# {{name}}\n',
      },

      {
        type: 'run',
        data: {
          command: 'curl https://www.toptal.com/developers/gitignore/api/macos,visualstudiocode,git,linux,windows,node,python,rust,go,typescript,javascript > .gitignore',
        },
      },

      {
        skip: () => existsSync('.git') && 'Skipping git initialization',
        type: 'run',
        data: { command: 'git init --initial-branch=main' },
      },

      {
        skip: ({ language }) => (language !== 'typescript' && language !== 'javascript') && 'Skipping bun install',
        type: 'run',
        data: { command: 'bun install' },
      },

      {
        type: 'run',
        data: { command: 'bunx husky install' },
      },

      {
        type: 'add',
        path: '.husky/commit-msg',
        template: 'bunx commitlint --edit $1\n',
      },
    ],
  }
}

function getExtension(language) {
  switch (language) {
    case 'typescript':
      return 'ts'
    case 'javascript':
      return 'js'
    case 'python':
      return 'py'
    case 'go':
      return 'go'
    case 'rust':
      return 'rs'
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}

function getMainFileContent(language) {
  switch (language) {
    case 'typescript':
    case 'javascript':
      return '#!/usr/bin/env bun\n\nfunction main() {\n\n}\n\nvoid main()\n'
    case 'python':
      return '#!/usr/bin/env python3\n\nif __name__ == "__main__":\n    pass\n'
    case 'go':
      return 'package main\n\nfunc main() {\n\n}\n'
    case 'rust':
      return '#!/usr/bin/env rust\n\nfn main() {\n\n}\n'
    default:
      throw new Error(`Unsupported language: ${language}`)
  }
}
