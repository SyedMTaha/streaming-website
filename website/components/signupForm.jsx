"use client"

import {auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import background from "../public/assets/images/background/signup.png";

export default function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  // const router = useRouter();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });

      // Redirect to home page or dashboard
      router.push('/dashboard');
    } catch (error) {
      setError(error.message);
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center" style={{       
      backgroundColor: "#020D1E",
      backgroundImage: "url('/assets/images/background/signup.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundBlend: "overlay"
     }}>
      <div className="bg-[#191C33] ml-10 rounded-[10px] p-8 flex items-center justify-center" style={{ width: '600px', height: '550px' }} >
      <div className="bg-navy-800/90 p-10 rounded-lg shadow-xl w-full max-w-md ">
        <h1 className="text-white text-3xl font-bold text-center mb-2">Sign Up</h1>
        <p className="text-gray-300 text-center mb-8">Create your account to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-2">
            <label htmlFor="name" className="text-white block">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#A1AABF] border-0 text-black placeholder:text-gray-200 h-12 rounded px-3"
                placeholder="Enter your name"
                style={{borderRadius: "8px"}}
              />
              <label htmlFor="email" className="text-white block">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#A1AABF] border-0 text-black placeholder:text-gray-200 h-12 rounded px-3 `"
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
                className="w-full bg-[#A1AABF] border-0 text-black placeholder:text-gray-200 h-12 rounded px-3" 
                placeholder="Enter your password" style={{borderRadius: "8px"}}
              />
            </div>


            <button 
              type="submit" 
              className="w-full bg-[#1D50A3]  hover:bg-blue-900 text-white h-12 font-medium " style={{borderRadius: "8px"}}
            >
              Sign Up
            </button>

            <div className="text-center text-gray-300 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#1d50a3] hover:underline">
                Login here
              </Link>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}