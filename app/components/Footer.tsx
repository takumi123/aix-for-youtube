'use client';
export default function Footer() {
  return (
    <footer className="bg-white py-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h3 className="font-bold text-lg mb-4 text-black">AIx for Youtube</h3>
          <p className="text-sm text-black">
            小規模事業者・個人事業主向けの動画マーケティング支援サービス
          </p>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center">
          <p className="text-sm text-black">
            © {new Date().getFullYear()} AIx for Youtube. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
