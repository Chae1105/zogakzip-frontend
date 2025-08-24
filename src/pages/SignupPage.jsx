import React from "react";
import AuthForm from "../components/AuthForm";

function SignupPage() {
  return (
    <div className="signup-page">
      <div className="auth-container">
        <AuthForm mode="signup" />
      </div>
    </div>
  );
}

export default SignupPage;
