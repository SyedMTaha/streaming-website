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
    <footer className="relative z-10 bg-gradient-to-t from-[#07295B] to-[#020D1F] text-white">
      <div className="w-full max-w-screen-2xl mx-auto px-8 py-12">
        <div className="w-full flex flex-col md:flex-row md:items-start justify-center">
          {/* Logo and Slogan */}
          <div className="flex flex-col items-center justify-center md:pr-10 w-full md:w-auto">
            <Image src={logo2 || "/placeholder.svg"} alt="INBV TV" width={150} height={150} className="object-contain mb-4" />
            <span className="text-base font-medium text-center md:text-left whitespace-nowrap">Premiums Quality Movies & Series</span>
          </div>

          {/* Genres Columns (with smaller gap between them) */}
          <div className="flex flex-row w-full md:w-auto">
            <div className="flex flex-col items-center md:items-start justify-center md:pr-4 w-1/2 md:w-auto">
              <h3 className="text-lg font-medium mb-6 pt-2 tracking-wide text-white text-center md:text-center">Genres</h3>
              <ul className="space-y-2">
                <FooterLink href="/genre/action">Action</FooterLink>
                <FooterLink href="/genre/drama">Drama</FooterLink>
                <FooterLink href="/genre/cartoon">Cartoon</FooterLink>
                <FooterLink href="/genre/sci-fi">Sci-Fi</FooterLink>
                <FooterLink href="/genre/thriller">Thriller</FooterLink>
              </ul>
            </div>
            <div className="flex flex-col items-center md:items-start justify-center md:pl-4 w-1/2 md:w-auto">
              {/* <h3 className="text-lg font-medium mb-6 pt-2 tracking-wide text-white text-center md:text-left invisible">Genres</h3> */}
              <ul className="space-y-2 mt-15">
                <FooterLink href="/genre/adventure">Adventure</FooterLink>
                <FooterLink href="/genre/mystery">Mystery</FooterLink>
                <FooterLink href="/genre/comedy">Comedy</FooterLink>
                <FooterLink href="/genre/romance">Romance</FooterLink>
                <FooterLink href="/genre/western">Western</FooterLink>
              </ul>
            </div>
          </div>

          {/* Divider after genres */}
          <div className="hidden md:flex md:flex-col md:justify-center md:mx-4">
            <div className="h-52 w-0.5 bg-white" />
          </div>

          {/* Help */}
          <div className="flex flex-col items-center md:items-start justify-center w-full md:w-auto md:pr-8 md:pl-3">
            <h3 className="text-lg font-medium mb-6 pt-2 tracking-wide text-white  text-center md:text-left  ">Help</h3>
            <ul className="space-y-2 mb-8">
              <li className="text-sm text-gray-300">My Account ({userEmail ? userEmail : 'Not signed in'})</li>
              <li className="text-sm text-gray-300">Customer Support (inbvtv@gmail.com)</li>
              <li className="text-sm text-gray-300">Contact Us (0311-523-0749)</li>
            </ul>
          </div>

          {/* Divider after help */}
          <div className="hidden md:flex md:flex-col md:justify-center md:mx-4">
            <div className="h-52 w-0.5 bg-white" />
          </div>

          {/* Connect with us (Social Icons) */}
          <div className="flex flex-col items-center justify-center w-full md:w-auto">
            <h3 className="text-lg font-medium mb-6 pt-2 tracking-wide text-white">Connect with us</h3>
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
        <div className="max-w-screen-2xl mx-auto px-8 flex flex-col md:flex-row md:justify-between md:items-center items-center gap-2 md:gap-0">
          <p className="text-sm text-gray-400 text-center md:text-left">Copyright © 2025. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mt-2 md:mt-0 items-center">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors text-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors text-center">
              Term & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}