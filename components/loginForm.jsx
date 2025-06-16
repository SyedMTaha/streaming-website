"use client"

import React, { useState } from "react";
import Link from "next/link";
import { auth } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Menu, X } from 'lucide-react';
import Image from "next/image";
import logo from "../public/assets/images/logo/logo.png";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleResendVerification = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setError('Verification email has been resent. Please check your inbox.');
      }
    } catch (error) {
      setError('Failed to resend verification email. Please try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setIsLoading(true);
    
    try {
      // Attempt to sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (user) {
        if (!user.emailVerified) {
          setError(
            <div>
              Your email is not verified. 
              <button 
                onClick={handleResendVerification}
                className="ml-2 text-blue-400 hover:text-blue-300 underline"
              >
                Resend verification email
              </button>
            </div>
          );
          return;
        }
        // Successful login
        console.log("Login successful");
        router.push('/home');
      }
    } catch (error) {
      // Handle specific error cases
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        default:
          setError('Failed to login. Please try again.');
          break;
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        router.push('/home');
      }
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error("Google sign in error:", error);
    } finally {
      setIsLoading(false);
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
                Login
              </h1>
              <p className="text-gray-300 text-m leading-relaxed">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <div className="text-red-500 text-sm text-center">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
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
                    placeholder="Enter your email"
                    style={{ borderRadius: "8px" }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-white block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-gradient-to-r from-[#A1AABF] to-[#B5BED0] border-0 text-gray-800 placeholder:text-gray-500 h-12 rounded-lg px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
                      placeholder="Enter your password"
                      style={{ borderRadius: "8px" }}
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
                </div>

                <div className="flex items-center mt-2">
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
                  className="w-full bg-[#1D50A3] text-white h-12 font-semibold rounded hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  style={{ borderRadius: "8px" }}
                >
                  Login
                </button>

                <div className=" mb-5 flex items-center">
                  <div className="flex-1 border-t border-gray-600"></div>
                  <span className="mx-4 text-gray-400">or</span>
                  <div className="flex-1 border-t border-gray-600"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full bg-white text-gray-800 hover:bg-gray-100 h-12 font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-center"
                  style={{ borderRadius: "8px" }}
                >
                  <img 
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                    alt="Google logo" 
                    className="w-5 h-5 mr-2"
                  />
                  Continue with Google
                </button>

                <div className="mt-2 text-center text-gray-300 text-sm">
                  Not a member?{" "}
                  <Link href="/auth/signup" className="text-[#1D50A3] hover:underline transition-colors duration-200">
                    Create an account
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