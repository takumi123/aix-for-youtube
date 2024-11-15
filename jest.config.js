import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // next.config.jsとテスト環境用の.envファイルが配置されたディレクトリをセット
  dir: './',
});

// Jest のカスタム設定を設置する場所
const customJestConfig = {
  // テストファイルのパターンを指定
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  // テストで使用するモジュールの設定
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  // テスト環境を指定
  testEnvironment: 'jest-environment-jsdom',
  // テストの前に実行するセットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // トランスフォーム設定
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  // ESMモジュールを含むパッケージもトランスフォームの対象にする
  transformIgnorePatterns: [
    '/node_modules/(?!(next-auth|@babel/runtime|jose|openid-client|preact|uuid)/)'
  ],
  // モジュール解決の設定
  moduleDirectories: ['node_modules', '<rootDir>'],
  // テストカバレッジの設定
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
};

// createJestConfigを定義することによって、本ファイルで定義された設定がNext.jsの設定に反映されます
module.exports = createJestConfig(customJestConfig);
