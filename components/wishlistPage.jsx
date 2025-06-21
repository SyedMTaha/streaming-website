"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '../firebase';
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

const groupByType = (items) => {
  return items.reduce((acc, item) => {
    acc[item.type] = acc[item.type] || [];
    acc[item.type].push(item);
    return acc;
  }, {});
};

const fetchWishlistSection = async (db, userId, section) => {
  const colRef = collection(db, 'wishlists', userId, section);
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    type: section === 'tv-series' ? 'tv-series' : section.slice(0, -1)
  }));
};

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchWishlist(user.uid);
      } else {
        setIsAuthenticated(false);
        const redirectUrl = searchParams.get('redirect') || '/wishlist';
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
    });

    return () => unsubscribe();
  }, [router, searchParams]);
  
  const fetchWishlist = async (userId) => {
    setLoading(true);
    const db = getFirestore();
    const sections = ['movies', 'cartoons', 'tv-series'];
    let allItems = [];
    for (const section of sections) {
      const items = await fetchWishlistSection(db, userId, section);
      allItems = allItems.concat(items);
    }
    setWishlist(allItems);
    setLoading(false);
  };

  const grouped = groupByType(wishlist);

  const handleRemove = async (item) => {
    const db = getFirestore();
    const userId = auth.currentUser.uid;
    const section = item.type === 'movie' ? 'movies' : item.type === 'cartoon' ? 'cartoons' : 'tv-series';
    const itemRef = doc(db, 'wishlists', userId, section, item.id);
    await deleteDoc(itemRef);
    setWishlist((prev) => prev.filter((w) => !(w.id === item.id && w.type === item.type)));
  };

  if (!isAuthenticated) {
    return <div className="min-h-screen w-full flex items-center justify-center"><p className="text-white">Redirecting to login...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] text-white px-4 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 bg-[#1a2236] px-4 py-2 rounded-full text-white hover:bg-[#223] flex items-center gap-2"
      >
        <span className="text-lg">←</span> Back
      </button>
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading wishlist...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-gray-400">Your wishlist is empty.</p>
        ) : (
          <>
            {grouped.movie && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Movies</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {grouped.movie.map((item) => (
                    <div key={item.id} className="bg-[#1a2236] rounded-lg p-4 flex flex-col items-center">
                      <img src={item.thumbnail || item.image} alt={item.title} className="w-32 h-44 object-cover rounded mb-2" />
                      <span className="font-medium">{item.title}</span>
                      <button
                        onClick={() => handleRemove(item)}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {grouped.cartoon && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">Cartoons</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {grouped.cartoon.map((item) => (
                    <div key={item.id} className="bg-[#1a2236] rounded-lg p-4 flex flex-col items-center">
                      <img src={item.thumbnail || item.image} alt={item.title} className="w-32 h-44 object-cover rounded mb-2" />
                      <span className="font-medium">{item.title}</span>
                      <button
                        onClick={() => handleRemove(item)}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {grouped['tv-series'] && (
              <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-4">TV Series</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {grouped['tv-series'].map((item) => (
                    <div key={item.id} className="bg-[#1a2236] rounded-lg p-4 flex flex-col items-center">
                      <img src={item.thumbnail || item.image} alt={item.title} className="w-32 h-44 object-cover rounded mb-2" />
                      <span className="font-medium">{item.title}</span>
                      <button
                        onClick={() => handleRemove(item)}
                        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
