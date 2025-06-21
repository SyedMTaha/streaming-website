"use client"

import dynamic from 'next/dynamic';

const WishlistPage = dynamic(() => import('../../../components/wishlistPage'), {
  loading: () => <div className="min-h-screen w-full flex items-center justify-center"><p className="text-white">Loading Wishlist...</p></div>,
  ssr: false
});

export default function Page() {
  return (
    <div>
      <WishlistPage />
    </div>
  );
}
