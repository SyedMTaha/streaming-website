"use client"

import SignupForm from "../../../../components/signupForm";


export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center sm:items-start px-2 sm:px-12 py-8">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#020D1E] via-[#020D1E]/70 to-transparent z-0" />
      {/* Content with higher z-index */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg sm:ml-0 sm:mr-auto">
        <SignupForm />
      </div>
    </div>
  );
}