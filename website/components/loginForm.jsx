"use client"

import React, { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ email, password, rememberMe });
  };

  return (
     
    <div className="bg-[#191C33] ml-4 rounded-[10px] p-6 flex items-center justify-start shadow-2xl" style={{ width: '500px', height: '465px' }}>
    <div className="bg-navy-800/90 p-8 rounded-lg shadow-xl w-full max-w-md">
      <h1 className="text-white text-3xl font-bold text-center mb-2">Login</h1>
      <p className="text-gray-300 text-center mb-8">Enter you credentials to access your account</p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-white block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
              placeholder="Enter your email" style={{borderRadius: "8px"}}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-white block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
              placeholder="Enter your password" style={{borderRadius: "8px"}}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-gray-400" 
            />
            <label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-300"> 
              Remember me
            </label>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#1D50A3] text-white h-12 font-semibold rounded hover:bg-blue-900  transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"  style={{borderRadius: "8px"}}
          > 
            Login
          </button>

          <div className="text-center text-gray-300 text-sm">
            Not a member?{" "}
            <Link href="/auth/signup" className="text-[#1D50A3] hover:underline transition-colors duration-200">
              Create an account
            </Link>
          </div>
        </div>
      </form>
    </div>
    </div>
    
  );
}