"use client";
import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Github, Youtube, Instagram } from "lucide-react"
import logo2 from './../public/assets/images/logo/logo2.png';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

function FooterLink(props) {
  return (
    <li>
      <Link href={props.href} className="text-sm text-gray-300 hover:text-white transition-colors">
        {props.children}
      </Link>
    </li>
  )
}

export default function Footer() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const XIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );

  const TikTokIcon = ({ className }) => (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  return (
    <footer className="relative z-10 bg-gradient-to-t from-[#07295B] to-[#020D1F] text-white mt-20 ">
      <div className="container mx-auto px-4 py-2 flex flex-col items-center justify-center">
        <div className="relative flex flex-col items-center w-full">
          {/* Floating Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-22 z-20">
            <Image src={logo2 || "/placeholder.svg"} alt="INBV TV" width={180} height={180} className="object-contain" />
          </div>
          {/* Social Section */}
          <div className="pt-25 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-2 mt-2 tracking-wide text-white">Connect with us</h3>
            <div className="flex flex-row space-x-3 mt-2 mb-8">
              <Link href="https://www.facebook.com/share/1P7zFL7e2z/?mibextid=wwXIfr" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <Facebook className="h-5 w-5 text-[#0a2151]" />
              </Link>
              <Link href="https://twitter.com" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <XIcon className="h-5 w-5 text-[#0a2151]" />
              </Link>
              <Link href="https://www.instagram.com/inbvtv?igsh=dGN4Y2ZhMDExZWx5" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <Instagram className="h-5 w-5 text-[#0a2151]" />
              </Link>
              <Link href="https://www.youtube.com/@edwardredd-h1w" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <Youtube className="h-5 w-5 text-[#0a2151]" />
              </Link>
              <Link href="https://www.tiktok.com/@inbvtv?_t=ZS-8xAgUZayDgm&_r=1" className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity">
                <TikTokIcon className="h-5 w-5 text-[#0a2151]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-[#020D1E] py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center md:text-left">Copyright © 2025. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-2 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors text-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors text-center">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}