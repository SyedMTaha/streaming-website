import SignupForm from "../../../../components/signupForm";

export default function SignupPage() {
  return (
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
  );
}