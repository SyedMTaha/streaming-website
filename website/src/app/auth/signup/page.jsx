import SignupForm from "../../../../components/signupForm";
import Navbar from "../../../../components/navbar";


export default function SignupPage() {
  return (
    <>
    <Navbar/>
    <div
      className="h-[110vh] px-12 flex items-center"
      style={{
        backgroundColor: "#020D1E",
        backgroundImage: "url('/assets/images/background/signup.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlend: "overlay",
      }}
    >
      <SignupForm />
    </div>
    </>
  );
}