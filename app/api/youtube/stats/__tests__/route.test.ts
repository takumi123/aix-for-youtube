import '@testing-library/jest-dom';
import { GET } from '../route';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// next-authのモック
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn()
}));

// googleapisのモック
jest.mock('googleapis');

// authOptionsのモック
jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {}
}));

// テスト用のモックデータ
const mockSession = {
  user: {
    accessToken: 'mock-access-token'
  }
};

const mockChannelData = {
  data: {
    items: [{
      id: 'channel-id',
      statistics: {
        subscriberCount: '1000',
        viewCount: '5000',
        videoCount: '100'
      },
      snippet: {
        title: 'Test Channel',
        description: 'Test Description',
        publishedAt: '2024-01-01T00:00:00Z'
      }
    }]
  }
};

const mockVideosSearchData = {
  data: {
    items: [
      { id: { videoId: 'video1' } },
      { id: { videoId: 'video2' } }
    ]
  }
};

const mockVideosDetailsData = {
  data: {
    items: [
      {
        id: 'video1',
        snippet: {
          title: 'Video 1',
          description: 'Description 1',
          publishedAt: '2024-01-01T00:00:00Z',
          thumbnails: {
            medium: { url: 'thumbnail1.jpg' }
          }
        },
        statistics: {
          viewCount: '100',
          likeCount: '10',
          commentCount: '5'
        }
      },
      {
        id: 'video2',
        snippet: {
          title: 'Video 2',
          description: 'Description 2',
          publishedAt: '2024-01-02T00:00:00Z',
          thumbnails: {
            medium: { url: 'thumbnail2.jpg' }
          }
        },
        statistics: {
          viewCount: '200',
          likeCount: '20',
          commentCount: '8'
        }
      }
    ]
  }
};

describe('YouTube Stats API', () => {
  beforeEach(() => {
    // モックをリセット
    jest.clearAllMocks();

    // getServerSession のモック
    const { getServerSession } = require('next-auth/next');
    getServerSession.mockResolvedValue(mockSession);

    // YouTube API のモック
    const mockYouTube = {
      channels: {
        list: jest.fn().mockResolvedValue(mockChannelData)
      },
      search: {
        list: jest.fn().mockResolvedValue(mockVideosSearchData)
      },
      videos: {
        list: jest.fn().mockResolvedValue(mockVideosDetailsData)
      }
    };
    (google.youtube as jest.Mock).mockImplementation(() => mockYouTube);
    (google.auth.OAuth2 as jest.Mock).mockImplementation(() => ({
      setCredentials: jest.fn()
    }));
  });

  it('正常系: チャンネル統計とビデオ情報を取得できる', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response).toBeInstanceOf(NextResponse);
    expect(data).toEqual({
      channelTitle: 'Test Channel',
      channelDescription: 'Test Description',
      subscriberCount: '1000',
      viewCount: '5000',
      videoCount: '100',
      publishedAt: '2024-01-01T00:00:00Z',
      videos: [
        {
          id: 'video1',
          title: 'Video 1',
          description: 'Description 1',
          publishedAt: '2024-01-01T00:00:00Z',
          viewCount: '100',
          likeCount: '10',
          commentCount: '5',
          thumbnail: 'thumbnail1.jpg'
        },
        {
          id: 'video2',
          title: 'Video 2',
          description: 'Description 2',
          publishedAt: '2024-01-02T00:00:00Z',
          viewCount: '200',
          likeCount: '20',
          commentCount: '8',
          thumbnail: 'thumbnail2.jpg'
        }
      ]
    });
  });

  it('異常系: セッションが存在しない場合エラーを返す', async () => {
    const { getServerSession } = require('next-auth/next');
    getServerSession.mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'YouTubeデータの取得に失敗しました: アクセストークンが見つかりません。再度ログインしてください。'
    });
  });

  it('異常系: チャンネル情報が存在しない場合エラーを返す', async () => {
    const mockEmptyChannelData = {
      data: {
        items: []
      }
    };

    const mockYouTube = {
      channels: {
        list: jest.fn().mockResolvedValue(mockEmptyChannelData)
      }
    };
    (google.youtube as jest.Mock).mockImplementation(() => mockYouTube);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'YouTubeデータの取得に失敗しました: YouTubeチャンネル情報が見つかりません'
    });
  });

  it('異常系: YouTube APIがエラーを返す場合', async () => {
    const mockYouTube = {
      channels: {
        list: jest.fn().mockRejectedValue(new Error('API Error'))
      }
    };
    (google.youtube as jest.Mock).mockImplementation(() => mockYouTube);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      error: 'YouTubeデータの取得に失敗しました: API Error'
    });
  });
});
