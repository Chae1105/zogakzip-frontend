import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      await login(email, password);
      console.log("로그인 성공!");
    } catch (err) {
      setErr(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일을 입력하세요"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요."
      />
      <button type="submit">로그인</button>

      {err && <p style={{ color: "red" }}>{err}</p>}
    </form>
  );
}

export default LoginForm;
