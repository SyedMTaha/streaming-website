"use client"

import LoginForm from "../../../../components/loginForm";


export default function LoginPage() {
  return (
    <div className="min-h-screen">
      {/* <NavbarLogo /> */}
      <div className="h-[122vh] px-12 pt-12 flex items-center relative">
      <div className="relative z-10">
          <LoginForm/>
        </div>
      </div>
    </div>
  );
}