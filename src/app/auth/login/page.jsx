"use client"

import LoginForm from "../../../../components/loginForm";


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