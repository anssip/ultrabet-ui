import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://betapi.anssipiirainen.com/graphql',
  documents: ['src/**/*.graphql'],
  generates: {
    'src/gql/types.generated.ts': { plugins: ['typescript'] },
    'src/gql/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'types.generated.ts',
      },
      plugins: ['typescript-operations', 'typed-document-node'],
    },
  },
}

export default config
