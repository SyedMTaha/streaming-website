// "use client"

// import React, { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X } from "lucide-react";
// import logo from "../public/assets/images/logo/logo.png";

// export default function NavbarLogo() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   return (
//     <div className="absolute top-0 left-0 right-0 z-50">
//       <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent"></div>
//       <nav className="relative py-4 w-full">
//         <div className="container mx-auto px-4 sm:px-8 lg:px-16">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4 sm:space-x-8">
//               <Link href="/" className="flex items-center">
//                 <div className="relative flex items-center justify-center h-10 w-24">
//                   <Image src={logo || "/placeholder.svg"} alt="INBV Logo" width={100} height={40} priority />
//                 </div>
//               </Link>
//             </div>

//             <div className="flex items-center space-x-2 sm:space-x-0">
//               <Link href="/auth/login">
//                 <button className="bg-[#1D50A3] text-white hover:bg-blue-300 font-semibold px-4 py-2.5 rounded-lg flex items-center text-md shadow-md hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50">
//                   <span className="hidden sm:inline">Watch Now</span>
//                   <span className="sm:hidden">Watch</span>
//                 </button>
//               </Link>

//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="text-white hover:text-blue-400 transition-colors md:hidden"
//               >
//                 {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//               </button>
//             </div>
//           </div>

//           {/* Mobile menu */}
//           {isMobileMenuOpen && (
//             <div className="md:hidden absolute inset-x-0 top-16 bg-[#1a1a3a]/95 border-t border-blue-900/30 z-50 max-h-[80vh] overflow-y-auto">
//               <div className="px-2 pt-2 pb-3 space-y-1">
//                 <Link href="/" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
//                   Home
//                 </Link>
//                 <Link href="/live-tv" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
//                   Live TV
//                 </Link>
//                 <Link href="/blog" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
//                   Blog
//                 </Link>
//                 <Link href="/about" className="block px-3 py-2 text-white hover:text-blue-400 hover:bg-blue-600/10 rounded transition-colors duration-200">
//                   About Us
//                 </Link>
//               </div>
//             </div>
//           )}
//         </div>
//       </nav>
//     </div>
//   );
// } 