"use client"

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { auth } from '../../../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  const scrollRef = useRef(null);
  const locomotiveScroll = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      import('locomotive-scroll').then((locomotiveScrollModule) => {
        locomotiveScroll.current = new locomotiveScrollModule.default({
          el: scrollRef.current,
          smooth: true,
          lerp: 0.08,
        });
      });
      import('locomotive-scroll/dist/locomotive-scroll.css');
    }
    return () => {
      if (locomotiveScroll.current) {
        locomotiveScroll.current.destroy();
        locomotiveScroll.current = null;
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setEmailSent(true);
      setMessage('Password reset email sent! Check your inbox.');
      
      // Redirect to login after 5 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 5000);
    } catch (error) {
      console.error('Password reset error:', error);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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

      <div
        ref={scrollRef}
        data-scroll-container
        className="min-h-screen w-full relative"
        style={{ background: 'transparent' }}
      >
        <div className="flex items-center justify-center sm:justify-start min-h-screen px-2 sm:px-12 py-8 relative z-10">
          <div
            className="bg-[#191C33] rounded-[10px] p-4 sm:p-8 flex flex-col items-center justify-center shadow-2xl w-full max-w-md sm:max-w-lg"
            style={{ minHeight: "400px" }}
          >
            <div className="p-4 sm:p-8 rounded-xl w-full">
              {/* Back to login link */}
              <Link 
                href="/auth/login"
                className="flex items-center text-gray-300 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>

              <div className="text-center mb-6">
                <h1 className="text-white text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text">
                  Forgot Password?
                </h1>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <div className="text-red-500 text-sm text-center">{error}</div>
                </div>
              )}

              {message && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <div className="text-green-500 text-sm text-center">{message}</div>
                </div>
              )}

              {!emailSent ? (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-white block">
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
                        style={{ borderRadius: "8px" }}
                        disabled={isLoading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#1D50A3] text-white h-12 font-semibold rounded hover:bg-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ borderRadius: "8px" }}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Email'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-white text-xl font-semibold mb-2">Email Sent!</h3>
                    <p className="text-gray-300 text-sm">
                      We've sent a password reset link to your email address.
                    </p>
                  </div>
                  <p className="text-gray-400 text-xs">
                    Redirecting to login page in a few seconds...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
