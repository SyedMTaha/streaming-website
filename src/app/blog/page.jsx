"use client"

import Blog from "../../../components/blogPage";
import NavbarTwo from "../../../components/navbarSearch";
import Footer from "../../../components/footer";
import { useEffect, useRef } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";


export default function BlogPage() {
  const scrollRef = useRef(null);

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.04,
    });
    return () => scroll.destroy();
  }, []);

  return (
    <div
    ref={scrollRef}
    data-scroll-container
    className="min-h-screen"
    style={{ background: "linear-gradient(to top, #020E21 0%, #091F4E 50%, #020D23 100%)" }}
  >
      <NavbarTwo />
      <Blog/>
      <Footer/>
    </div>
  );
}