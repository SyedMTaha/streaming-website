"use client"

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logo2 from './../public/assets/images/logo/logo.png';
import { useRouter } from 'next/navigation';

const termPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-t from-[#020d1f] to-[#012256] text-white px-4 py-8 flex flex-col items-center">
      {/* Logo and Back Button */}
      <div className="w-full max-w-3xl flex flex-col items-center mb-8 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-0 top-2 flex items-center gap-2 text-sm text-white bg-[#1a2236] px-4 py-2 rounded-full hover:bg-[#223]"
        >
          <span className="text-lg">←</span> BACK
        </button>
        <Image src={logo2} alt="INBV TV" width={150} height={150} className="mx-auto mb-2" />
      </div>
      {/* Main Content */}
      <div className="w-full max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Terms & Conditions</h1>
        <ol className="list-decimal list-inside text-lg mb-8 space-y-1">
          <li>Introduction</li>
          <li>The Service Provided by Us</li>
          <li>Your Use of the Service</li>
          <li>Content and Intellectual Property Rights</li>
          <li>Customer Support, Information, Questions and Complaints</li>
          <li>Problems and Disputes</li>
          <li>About these Terms</li>
        </ol>
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">1. Introduction</h2>
          <p className="mb-2 text-gray-300">Please read these Terms of Use (these <b>"Terms"</b>) carefully as they govern your use of our personalized services for streaming content and other content, including all of our websites and software applications that incorporate or link to these Terms (collectively, the <b>"Service"</b>) and any music, videos, podcasts, or other material that is made available through the Service (the <b>"Content"</b>).</p>
          <p className="mb-2 text-gray-300">Use of the Service may be subject to additional terms and conditions presented by us, which are hereby incorporated by this reference into these Terms.</p>
          <p className="mb-2 text-gray-300">By signing up for, or otherwise using, the Service, you agree to these Terms. If you do not agree to these Terms, then you must not use the Service or access any Content.</p>
          <h3 className="text-lg font-semibold mt-4 mb-1">Service Provider</h3>
          <p className="mb-2 text-gray-300">These Terms are between you and INBV TV, [Your Company Address].</p>
          <h3 className="text-lg font-semibold mt-4 mb-1">Age and eligibility requirements</h3>
          <p className="mb-2 text-gray-300">In order to use the Service and access any Content, you need to (1) be 13 years of age (or the equivalent minimum age in your home country) or older, (2) have parent or guardian consent if you are a minor in your home country, (3) have the power to enter a binding contract with us and not be barred from doing so under any applicable laws, and (4) reside in a country where the Service is available. You also promise that any registration information that you submit to us is true, accurate, and complete, and you agree to keep it that way at all times. If you are a minor in your home country, your parent or guardian will need to enter into these Terms on your behalf. You can find additional information regarding minimum age requirements in the registration process. If you do not meet the minimum age requirements then you will be unable to register as a user.</p>
        </div>
        {/* Add more sections as needed */}
      </div>
    </div>
  );
};

export default termPage
