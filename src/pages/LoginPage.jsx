import React from "react";
import AuthForm from "../components/AuthForm";

function LoginPage() {
  return (
    <div className="login-page">
      <div className="auth-container">
        <AuthForm mode="login" />
      </div>
    </div>
  );
}

export default LoginPage;
