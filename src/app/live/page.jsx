"use client"

import React from "react"
import { useEffect, useRef } from "react";
import Navbar from "../../../components/navbarSearch";
import Footer from "../../../components/footer";
import Live from "../../../components/livetvPage";

export default function LivePage() {
  const scrollRef = useRef(null);

  useEffect(() => {
    let scroll;
    import("locomotive-scroll").then((LocomotiveScroll) => {
      scroll = new LocomotiveScroll.default({
        el: scrollRef.current,
        smooth: true,
        lerp: 0.04,
      });
    });
    import("locomotive-scroll/dist/locomotive-scroll.css");
    return () => {
      if (scroll) scroll.destroy();
    };
  }, []);
  
    return (
      <div
      ref={scrollRef}
      data-scroll-container
      className="min-h-screen"
      style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
    >
            <Navbar />
            <Live/>
            <Footer/>
      </div>
    );
}
