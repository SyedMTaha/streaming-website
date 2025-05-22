import LoginForm from "../../../../components/loginForm";

export default function LoginPage() {
  return (
    <div
      className="h-[90vh] px-12 flex items-center"
      style={{
        backgroundColor: "#020D1E",
        backgroundImage: "url('/assets/images/background/signup.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlend: "overlay",
      }}
    >
      <LoginForm />
    </div>
  );
}
