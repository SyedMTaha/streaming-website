import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Github } from "lucide-react"
import logo2 from './../public/assets/images/logo/logo2.png';

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
  return (
    <footer className="relative z-10 bg-gradient-to-t from-[#07295B] to-[#020D1F] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-35">
          {/* Logo and Social Media */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <Image
                src={logo2}
                alt="INBV TV"
                width={150}
                height={150}
                
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">Connect with us</p>
              <div className="flex space-x-4">
                <Link
                  href="https://facebook.com"
                  className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity"
                >
                  <Facebook className="h-5 w-5 text-[#0a2151]" />
                </Link>
                <Link
                  href="https://twitter.com"
                  className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity"
                >
                  <Twitter className="h-5 w-5 text-[#0a2151]" />
                </Link>
                <Link
                  href="https://github.com"
                  className="bg-white rounded-full p-2 hover:opacity-80 transition-opacity"
                >
                  <Github className="h-5 w-5 text-[#0a2151]" />
                </Link>
              </div>
            </div>
          </div>

          {/* Must Watch Movies */}
          <div className="px-1">
            <h3 className="text-lg font-medium mb-4">Must Watch Movies</h3>
            <ul className="space-y-2">
              <FooterLink href="/movies/dj-thillu">DJ Thillu</FooterLink>
              <FooterLink href="/movies/the-great-empire">The Great Empire</FooterLink>
              <FooterLink href="/movies/love-story">Love Story</FooterLink>
              <FooterLink href="/movies/the-reckless">The Reckless</FooterLink>
              <FooterLink href="/movies/zombie-world">Zombie World</FooterLink>
            </ul>
          </div>

          {/* Genres */}
          <div className="px-4">
            <h3 className="text-lg font-medium mb-4">Genres</h3>
            <ul className="space-y-2">
              <FooterLink href="/genres/romance">Romance</FooterLink>
              <FooterLink href="/genres/drama">Drama</FooterLink>
              <FooterLink href="/genres/family">Family</FooterLink>
              <FooterLink href="/genres/comedy">Comedy</FooterLink>
              <FooterLink href="/genres/actions">Actions</FooterLink>
              <FooterLink href="/genres/adventure">Adventure</FooterLink>
            </ul>
          </div>

          {/* Help */}
          <div className="px-4">
            <h3 className="text-lg font-medium mb-4">Help</h3>
            <ul className="space-y-2">
              <FooterLink href="/account">My Account</FooterLink>
              <FooterLink href="/support">Customer Support</FooterLink>
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/advertise">Advertise</FooterLink>
              <FooterLink href="/jobs">Jobs</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-[#020D1E] py-4">
        <div className="container mx-16  flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">Copyright © 2025. All rights reserved.</p>
          <div className="flex space-x-6 mt-2  md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Term of Services
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}