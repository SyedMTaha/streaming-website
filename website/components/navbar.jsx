"use client"

import { useState } from "react"
import Link from "next/link"
import Image from 'next/image'
import { ChevronDown, Globe, Menu, X, User } from "lucide-react";
import logo from './../public/assets/images/logo/logo.png';

function NavItem({ href, label, mobile }) {
  return (
    <Link href={href} className={`text-white hover:text-blue-300 flex items-center ${mobile ? "" : "font-medium"}`}>
      {label}
      <ChevronDown className="h-4 w-4 ml-1" />
    </Link>
  )
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-gradient-to-b from-[#00112C] to-[#012256] py-4">
      <div className="px-16">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
            <div className="relative flex items-center justify-center h-8 w-18  " >
                <Image
                  src={logo}
                  alt="INBV Logo"
                  width={80}
                  height={32}
                  priority
                />
              </div>
            </Link>

            <div className="hidden md:flex space-x-6">
              <NavItem href="/" label="Home" />
              <NavItem href="/about" label="About Us" />
              <NavItem href="/live" label="Live TV" />
              <NavItem href="/blog" label="Blog" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center">
              <button className="text-white flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                EN
                <ChevronDown className="h-4 w-4 ml-1" />
              </button>
            </div>

            <button className="bg-[#A2ABC0] text-[#183056] hover:bg-gray-300 text-navy-900 font-semibold p-2 ml-2 rounded-lg flex items-center"> <User className="h-5 w-5 mr-1"/>Watch Now</button>

            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-navy-800 rounded-lg p-4">
            <div className="flex flex-col space-y-3">
              <NavItem href="/" label="Home" mobile />
              <NavItem href="/about" label="About Us" mobile />
              <NavItem href="/live" label="Live TV" mobile />
              <NavItem href="/blog" label="Blog" mobile />
              <div className="pt-2 border-t border-navy-700">
                <Button variant="ghost" className="text-white flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  EN
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}