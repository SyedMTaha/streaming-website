"use client"

import {auth, db } from '../firebase';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Tv, Download, Dribbble, Smile, Plus, Menu, X } from 'lucide-react';
import logo from "../public/assets/images/logo/logo.png";


const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [termCondition, setTermCodition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccessMessage(""); // Clear previous success messages
    setIsLoading(true);
    
    // Validate terms and conditions FIRST
    if (!termCondition) {
      setIsLoading(false);
      // Don't set the general error, only set it for terms display
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }
    
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Send verification email
      await sendEmailVerification(user);
  
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        emailVerified: false,
        createdAt: new Date().toISOString()
      });
  
      // Show success message
      setSuccessMessage("Registration successful! Please check your email to verify your account.");
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (error) {
      console.error("Error during signup:", error);
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please use a different email or try logging in.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters long.');
          break;
        default:
          setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: new Date().toISOString()
      });

      router.push('/home');
    } catch (error) {
      setError(error.message);
      console.error("Error during Google sign in:", error);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Image with Gradient */}
      <div
        className="fixed inset-0 w-full h-full"
        style={{
          backgroundImage: "url('/assets/images/background/login3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#020D1E] via-[#020D1E]/70 to-transparent" />
      </div>

      {/* Form Container */}
      <div className="flex items-center justify-center min-h-screen pt-32 relative z-10">
        <div
          className="bg-[#191C33] rounded-[10px] p-4 sm:p-8 flex items-center justify-start shadow-2xl w-full max-w-[600px]"
          style={{ height: "670px", minHeight: "500px", width: '500px' }}
        >
          <div className="p-4 sm:p-8 rounded-xl w-full">
            <div className="text-center mb-6">
              <h1 className="text-white text-3xl font-bold mb-0 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                Sign Up
              </h1>
              <p className="text-gray-300 text-m leading-relaxed">Create your account to get started</p>
            </div>

            {/* Only show general errors that are not terms and conditions related */}
            {error && error !== "Please accept the terms and conditions to continue" && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-500 text-sm text-center">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="space-y-3">
                  <div>
                    <label htmlFor="name" className="text-white block text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-white block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-white block text-sm font-medium mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
                      placeholder="Create a strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {/* Password strength indicator */}
                  <div className="text-xs text-gray-400">
                    {password && password.length < 8 && (
                      <span className="text-red-400">Password must be at least 8 characters long</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={termCondition}
                      onChange={(e) => {
                        setTermCodition(e.target.checked);
                        // Clear error when user checks the box
                        if (!e.target.checked) {
                          setError("Please accept the terms and conditions to continue");
                        } else {
                          setError("");
                        }
                      }}
                      className={`rounded border-gray-400 ${!termCondition ? "ring-2 ring-red-500" : ""}`}
                    />
                    <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-300">
                      I agree to <a href="/terms" className='text-blue-600 underline hover:text-blue-400'> Terms & Conditions </a> 
                    </label>
                  </div>
                  {!termCondition && (
                    <p className="text-red-400 text-xs mt-1 ml-6">Please accept the terms and conditions to continue</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#1D50A3] text-white hover:bg-blue-900 h-12 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  >
                    Create Account
                  </button>
                </div>

                <div className="my-4 flex items-center">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="mx-4 text-gray-400">or</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white text-gray-800 hover:bg-gray-100 h-12 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center"
                  >
                    <img 
                      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                      alt="Google logo" 
                      className="w-5 h-5 mr-2"
                    />
                    Sign up with Google
                  </button>
                </div>

                <div className="text-center text-gray-300 text-sm mt-4">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#1D50A3] font-medium hover:underline transition-colors duration-200"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;