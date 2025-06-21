"use client"

import dynamic from 'next/dynamic'
import React, { useRef, useEffect } from 'react';

const LoginForm = dynamic(() => import('../../../../components/loginForm'), { 
  loading: () => <div className="min-h-screen w-full flex items-center justify-center"><p className="text-white">Loading form...</p></div>,
  ssr: false 
});

export default function LoginPage() {
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);
 
  useEffect(() => {
    if (scrollRef.current) {
      import('locomotive-scroll').then((locomotiveScrollModule) => {
        locomotiveScroll.current = new locomotiveScrollModule.default({
          el: scrollRef.current,
          smooth: true,
          lerp: 0.08,
        });
      });
      import('locomotive-scroll/dist/locomotive-scroll.css');
    }
    return () => {
      if (locomotiveScroll.current) {
        locomotiveScroll.current.destroy();
        locomotiveScroll.current = null;
      }
    };
  }, []);

  return (
    <>
      {/* Background Image with Gradient */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/assets/images/background/login3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#020D1E] via-[#020D1E]/70 to-transparent" />
      </div>

      <div
        ref={scrollRef}
        data-scroll-container
        className="min-h-screen w-full relative"
        style={{ background: 'transparent' }}
      >
        <LoginForm locomotiveScroll={locomotiveScroll} />
      </div>
    </>
  );
}