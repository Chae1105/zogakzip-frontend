import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LogoutButton from "./LogoutButton";

function TopBar() {
  const { user, loading } = useAuth();
  console.log(user);
  // 로딩 중일 때는 빈 상태로 표시
  if (loading) {
    return (
      <nav className="top-bar">
        <div className="nav-brand">
          <Link to="/">Logo</Link> {/* 로고 클릭 시 메인페이지로 이동하도록 */}
        </div>
        <div className="nav-auth">로딩 중...</div>
      </nav>
    );
  }

  return (
    <nav className="top-bar">
      <div className="nav-brand">
        <Link to="/">Logo</Link> {/* 로고 클릭 시 메인페이지로 이동하도록 */}
      </div>

      <div className="nav-auth">
        {user ? (
          <div>
            <span>안녕하세요, {user.email.split("@")[0]}님!</span>
            <LogoutButton className="logout-btn" />
          </div>
        ) : (
          <div>
            <Link to="/login" className="login-btn">
              로그인
            </Link>
            <Link to="/signup" className="signup-btn">
              회원가입
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopBar;
