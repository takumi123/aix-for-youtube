// components/CheckoutButton.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@nextui-org/react';

// 環境変数からStripeの公開キーを取得
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type CheckoutButtonProps = {
  priceId: string;
  planName?: string; 
  price?: number;
};

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ priceId, planName, price }) => {
  const handleClick = async () => {
    try {
      // Stripeインスタンスの初期化を確認
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripeの初期化に失敗しました');
      }

      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const session = await response.json();

      if (session.id) {
        const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('チェックアウトセッションの作成に失敗しました');
      }
    } catch (error) {
      console.error('決済処理中にエラーが発生しました:', error);
      // エラーメッセージをユーザーに表示する処理を追加することをお勧めします
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md">
      {planName && <h3 className="text-xl font-bold">{planName}</h3>}
      {price && <p className="text-2xl font-bold">¥{price.toLocaleString()}/月</p>}
      <Button 
        color="primary"
        onClick={handleClick}
        className="w-full"
      >
        今すぐ購入
      </Button>
    </div>
  );
};

export default CheckoutButton;
