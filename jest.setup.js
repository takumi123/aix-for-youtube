import '@testing-library/jest-dom';

// Next.jsのRequest/Responseのモック
global.Request = class Request {
  constructor() {
    return {};
  }
};

global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.init = init;
    this.status = init?.status || 200;
    this.headers = new Map(Object.entries(init?.headers || {}));
  }

  json() {
    return Promise.resolve(JSON.parse(this.body));
  }
};

// フェッチのモック
global.fetch = jest.fn();

// コンソールのエラー出力を抑制（必要に応じて）
console.error = jest.fn();

// 環境変数の設定
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';
process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = 'test-client-secret';
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000';

// テスト実行前のグローバルセットアップ
beforeAll(() => {
  // テスト実行前の共通セットアップがあれば追加
});

// テスト実行後のクリーンアップ
afterAll(() => {
  // モックのリセット
  jest.resetAllMocks();
});
