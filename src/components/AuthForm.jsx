import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // 로그인/회원가입 성공 후 메인 페이지 이동 위해

// 로그인+회원가입 폼, mode prop으로 로그인/회원가입 기능 구분
function AuthForm({ mode = "login" }) {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // loading과 disabled -> 로그인/회원가입 버튼을 중복해서 누르지 않게 하기 위해
  // 사용자 버튼 여러번 클릭 -> 중복 요청 발생 -> '처리중..' 표시 없으면 답답해함
  // disabled : 버튼 클릭 불가 -> 중복 요청 방지, 입력 필드 비활성화 -> 처리 중 데이터 변경 방지

  const isSignupMode = mode === "signup"; // 회원가입 모드로 설정할 때

  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
    setErr(""); // 이전 에러 메시지 지우기 위해
    setLoading(true);

    // 회원가입 모드일 때 비밀번호 확인 검증
    if (isSignupMode && password !== confirmPassword) {
      setErr("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return;
    }

    try {
      if (isSignupMode) {
        await signup(email, password);
        console.log("회원가입 성공!");
        navigate("/"); // 메인 페이지로 이동
      } else {
        await login(email, password);
        console.log("로그인 성공!");
        navigate("/"); // 메인 페이지로 이동
      }
    } catch (error) {
      setErr(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isSignupMode ? "회원가입" : "로그인"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요."
            required
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요."
            required
            disabled={loading}
          />
        </div>

        {/* 회원가입 모드일 때만 비밀번호 확인 필드도 표시 */}
        {isSignupMode && (
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요(확인)."
              required
              disabled={loading}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "처리중..." : isSignupMode ? "회원가입" : "로그인"}
        </button>
      </form>

      {/* 에러 메시지 */}
      {err && <p>{err}</p>}
    </div>
  );
}

export default AuthForm;
