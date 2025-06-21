"use client"

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Wishlist from "../../../components/wishlistPage";
import { auth } from '../../../firebase';

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login if not authenticated
        const redirectUrl = searchParams.get('redirect') || '/wishlist';
        router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router, searchParams]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render the page if not authenticated (will redirect to login)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Wishlist/>
    </div>
  )
}

export default page
