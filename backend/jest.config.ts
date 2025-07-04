import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
    '__tests__/helpers/',
    'build/',
  ],
  setupFilesAfterEnv: ['<rootDir>/__tests__/helpers/testSetup.ts'],
}

export default config
