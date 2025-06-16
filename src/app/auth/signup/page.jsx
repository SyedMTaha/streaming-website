import SignupForm from "../../../../components/signupForm";
import Navbar from "../../../../components/navbarLogo";

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <div className="h-[122vh] px-12 pt-12 flex items-center relative">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020D1E] via-[#020D1E]/70 to-transparent" />
        
        {/* Content with higher z-index */}
        <div className="relative z-10">
          <SignupForm/>
        </div>
      </div>
    </>
  );
}