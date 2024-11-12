'use client';

import { useRef, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, CardHeader, CardBody, CardFooter, Select, SelectItem, Textarea, NextUIProvider } from '@nextui-org/react';
import Header from '../../components/Header';
import Sidebar from '../../components/Business_Sidebar';
import Footer from '../../components/Footer';
import type { PutBlobResult } from '@vercel/blob';
import CheckoutButton from '../../components/CheckoutButton';

export default function DashboardPage() {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [recording, setRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [devices, setDevices] = useState<{
    videoDevices: MediaDeviceInfo[],
    audioDevices: MediaDeviceInfo[]
  }>({ videoDevices: [], audioDevices: [] });
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [editRequestText, setEditRequestText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  
  const [scriptContent, setScriptContent] = useState(`
    こんにちは。本日のテーマは「効果的なクライアント集客方法」についてお話しします。
    
    私の経験から、以下の3つのポイントが重要です：
    1. ターゲット層の明確化
    2. 価値提供の具体化 
    3. 継続的なコミュニケーション
    
    では、詳しく説明していきましょう。
    
    まず1つ目のターゲット層の明確化についてですが、ビジネスを成功させるためには、誰に向けてサービスを提供するのかを具体的に定める必要があります。年齢層、職業、興味関心、悩みなど、できるだけ詳細にペルソナを設定しましょう。
    
    2つ目の価値提供の具体化では、お客様が抱える課題に対して、どのような解決策を提供できるのかを明確にします。単なる商品やサービスの提供ではなく、それによってお客様の生活がどう改善されるのか、具体的なベネフィットを示すことが重要です。
    
    3つ目の継続的なコミュニケーションについては、一度きりの取引で終わらせるのではなく、長期的な関係性を築くことを目指します。定期的な情報発信やフォローアップ、カスタマーサポートの充実など、様々な接点を持ち続けることで、顧客ロイヤリティを高めることができます。
    
    これらの要素に加えて、オンラインマーケティングの活用も重要です。SNSやウェブサイト、メールマーケティングなど、デジタルツールを効果的に組み合わせることで、より広範囲に、かつ効率的に見込み客にアプローチすることが可能です。
    
    また、既存顧客からの紹介やクチコミも、新規顧客獲得の重要な手段となります。満足度の高いサービスを提供し、自然な形で推薦していただけるような関係性を構築することで、信頼性の高い形での集客が実現できます。
    
    最後に、これらの施策は一度実施して終わりではなく、継続的な改善が必要です。データ分析や顧客フィードバックを基に、常により良い方法を模索し、実践していくことが、長期的な成功につながります。
  `);

  // デバイス一覧の取得とデフォルト設定
  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ 
          video: {
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }, 
          audio: true 
        });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        
        setDevices({ videoDevices, audioDevices });
        
        // デフォルトデバイスを設定
        const defaultVideo = videoDevices[0]?.deviceId;
        const defaultAudio = audioDevices[0]?.deviceId;
        if (defaultVideo) setSelectedVideo(defaultVideo);
        if (defaultAudio) setSelectedAudio(defaultAudio);
      } catch (err) {
        console.error('デバイス一覧の取得に失敗:', err);
      }
    };
    getDevices();
  }, []);

  // カメラの初期化
  useEffect(() => {
    const initCamera = async () => {
      if (!selectedVideo || !selectedAudio) return;
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            deviceId: selectedVideo,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: { deviceId: selectedAudio }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('カメラの初期化に失敗しました:', err);
      }
    };

    initCamera();
  }, [selectedVideo, selectedAudio]);

  // 録画時間の更新
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recording]);

  // 録画開始
  const startRecording = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      mediaRecorderRef.current = recorder;

      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
      };

      recorder.start();
      setRecording(true);
      setRecordingTime(0);
    }
  };

  // 録画停止
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleEditRequest = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!recordedVideo) return;

    try {
      const response = await fetch(recordedVideo);
      const videoBlob = await response.blob();
      const filename = `video_${Date.now()}.webm`;

      const uploadResponse = await fetch(`/api/upload/video?filename=${filename}`, {
        method: 'POST',
        body: videoBlob
      });

      if (!uploadResponse.ok) {
        throw new Error(`アップロードに失敗しました: ${uploadResponse.statusText}`);
      }

      const newBlob = await uploadResponse.json() as PutBlobResult;
      setBlob(newBlob);
      setShowConfirmation(true);
    } catch (error) {
      console.error('動画のアップロードに失敗:', error instanceof Error ? error.message : String(error));
    }
  };

  const handleEditCancel = () => {
    setEditRequestText('');
    setShowConfirmation(false);
  };

  const handleEditConfirm = () => {
    // 編集リクエストの処理をここに実装
    console.log('編集リクエスト:', editRequestText);
    console.log('動画URL:', blob?.url);
    setEditRequestText('');
    setShowConfirmation(false);
  };

  return (
    <NextUIProvider>
      <div className="min-h-screen bg-white">
        <Header 
          userName={session?.user?.name}
          userEmail={session?.user?.email}
          userImage={session?.user?.image}
        />
        <div className="flex">
          <div className="mr-4">
            <Sidebar />
          </div>
          <div className="container mx-auto px-4">
            {/* ユーザー情報セクション */}
            <div className="flex gap-4">
              {/* 左カラム: カメラ/録画エリア */}
              <div className="w-[60%]">
                <Card className="p-4 h-full mt-4">
                  <CardHeader className="flex flex-col gap-4 px-4">
                    <div className="flex justify-between items-center w-full">
                      <p className="text-xl font-semibold">撮影画面</p>
                      {recording && (
                        <p className="text-red-500">
                          録画時間: {Math.floor(recordingTime / 60)}:{String(recordingTime % 60).padStart(2, '0')}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-4 w-full">
                      <Select 
                        label="カメラを選択"
                        value={selectedVideo}
                        onChange={(e) => setSelectedVideo(e.target.value)}
                        className="flex-1 text-black"
                      >
                        {devices.videoDevices.map((device) => (
                          <SelectItem key={device.deviceId} value={device.deviceId} className="text-black">
                            {device.label || `カメラ ${device.deviceId.slice(0, 5)}...`}
                          </SelectItem>
                        ))}
                      </Select>
                      <Select 
                        label="マイクを選択"
                        value={selectedAudio}
                        onChange={(e) => setSelectedAudio(e.target.value)}
                        className="flex-1 text-black"
                      >
                        {devices.audioDevices.map((device) => (
                          <SelectItem key={device.deviceId} value={device.deviceId} className="text-black">
                            {device.label || `マイク ${device.deviceId.slice(0, 5)}...`}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </CardHeader>
                  
                  {/* ライブカメラプレビュー */}
                  <CardBody>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ width: '100%', maxHeight: '400px' }}
                    />
                  </CardBody>

                  {/* 録画コントロール */}
                  <CardFooter>
                    {!recording ? (
                      <Button 
                        color="primary"
                        onPress={startRecording}
                      >
                        録画開始
                      </Button>
                    ) : (
                      <Button 
                        color="danger"
                        onPress={stopRecording}
                        className="text-black"
                      >
                        録画停止
                      </Button>
                    )}
                  </CardFooter>

                  {/* 録画済みビデオ再生と編集コントロール */}
                  {recordedVideo && (
                    <CardBody className="flex flex-col gap-4">
                      <p className="text-xl font-semibold">録画プレビュー</p>
                      <video
                        src={recordedVideo}
                        controls
                        playsInline
                        style={{ width: '100%', maxHeight: '300px' }}
                      />
                      <form onSubmit={handleEditRequest}>
                        <input type="file" ref={inputFileRef} className="hidden" />
                        <div className="flex gap-4">
                          <Button 
                            color="primary"
                            type="submit"
                          >
                            編集を依頼
                          </Button>
                          <Button 
                            color="danger"
                            onPress={handleEditCancel}
                          >
                            取り消し
                          </Button>
                        </div>
                      </form>
                      {showConfirmation && (
                        <div className="flex flex-col gap-4">
                          <Textarea
                            label="編集リクエスト内容"
                            placeholder="編集内容を入力してください"
                            value={editRequestText}
                            onChange={(e) => setEditRequestText(e.target.value)}
                            minRows={3}
                          />
                          <Button 
                            color="success"
                            onPress={handleEditConfirm}
                          >
                            確認して続行
                          </Button>
                          {blob && (
                            <div className="flex flex-col gap-2">
                              <div>
                                アップロードされた動画URL: <a href={blob.url} target="_blank" rel="noopener noreferrer">{blob.url}</a>
                              </div>
                              <Button
                                color="primary"
                                onClick={() => {
                                  // 新しいタブで開く
                                  window.open(blob.url, '_blank');
                                  
                                  // ダウンロードリンクを作成して実行
                                  const link = document.createElement('a');
                                  link.href = blob.url;
                                  link.download = 'recorded-video.mp4';
                                  link.target = '_blank';
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                }}
                              >
                                動画をダウンロード
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardBody>
                  )}
                  {/* CheckoutButtonコンポーネントのインポート */}
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <CheckoutButton
                      priceId="price_1QIuJfAQCAJwNpqU5qZ0Exdp"
                      planName="高品質編集プラン"
                      price={20000}
                    />
                    <CheckoutButton
                      priceId="price_1QIuJfAQCAJwNpqUvwP97XVq" 
                      planName="スタンダード編集プラン"
                      price={15000}
                    />
                    <CheckoutButton
                      priceId="price_1QIuJfAQCAJwNpqUQ4ixqGTx"
                      planName="ベーシック編集プラン"
                      price={10000}
                    />
                  </div>
                </Card>
              </div>
              {/* 台本表示エリア */}
              <div className="w-[40%] mt-4">
                <Card className="p-4 ">
                  <CardHeader className="flex justify-between items-center mb-2 py-2">
                    <p className="text-xl font-semibold">台本</p>
                  </CardHeader>
                  <CardBody>
                    <div className="">
                      <Textarea
                        value={scriptContent}
                        onChange={(e) => setScriptContent(e.target.value)}
                        className="w-full text-lg h-full"
                        minRows={150}
                        placeholder="台本を入力してください"
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Footer />
        </div>
      </div>
    </NextUIProvider>
  );
}
