"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dashboardPage from "../../../../components/dashboardPage";
import "locomotive-scroll/dist/locomotive-scroll.css";

export default function AdminDashboard() {
  const scrollRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    let scroll;
    import("locomotive-scroll").then((LocomotiveScroll) => {
      scroll = new LocomotiveScroll.default({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.04,
      });
    });
    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/auth/login");
  };

  return (
    <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative"
      style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
    >
      {/* Logout button at top right */}
      <button
        onClick={handleLogout}
        className="absolute top-6 right-8 bg-[#1D50A3] text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition z-20 shadow-lg"
      >
        Logout
      </button>
      <div className="flex flex-col items-center w-full max-w-7xl mb-8">
        <Image src="/assets/images/logo/logo.png" alt="Logo" width={120} height={60} className="mb-4" />
        
        {/* Dashboard Content */}
        <div className="w-full">
          {dashboardPage()}
        </div>
      </div>
    </div>
  );
}
