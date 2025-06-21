"use client"

import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('../../../../components/loginForm'), { 
  loading: () => <div className="min-h-screen w-full flex items-center justify-center"><p className="text-white">Loading form...</p></div>,
  ssr: false 
});

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row items-center sm:items-start px-2 sm:px-12 py-8">
      {/* <NavbarLogo /> */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg sm:ml-0 sm:mr-auto">
        <LoginForm />
      </div>
    </div>
  );
}