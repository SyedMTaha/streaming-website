"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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
    type: section.slice(0, -1) // e.g., 'movies' -> 'movie'
  }));
};

const wishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      if (!auth.currentUser) {
        setWishlist([]);
        setLoading(false);
        return;
      }
      const db = getFirestore();
      const userId = auth.currentUser.uid;
      const sections = ['movies', 'cartoons', 'tv-series'];
      let allItems = [];
      for (const section of sections) {
        const items = await fetchWishlistSection(db, userId, section);
        allItems = allItems.concat(items);
      }
      setWishlist(allItems);
      setLoading(false);
    };

    // Wait for auth to be ready
    const unsubscribe = auth.onAuthStateChanged(() => {
      fetchWishlist();
    });

    return () => unsubscribe();
  }, []);

  const grouped = groupByType(wishlist);

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
          <p className="text-center text-gray-400">Loading...</p>
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

export default wishlistPage;
