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
      <header>
        <div className="nav-brand">
          <Link to="/">Logo</Link> {/* 로고 클릭 시 메인페이지로 이동하도록 */}
        </div>
        <div className="nav-auth">로딩 중...</div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 h-20 bg-gray-100 shadow-md">
      <div className="grid grid-cols-3 p-5">
        <div></div> {/* 왼쪽은 비워두기 위해 */}
        <Link to="/" className="text-center text-2xl">
          조각집
        </Link>{" "}
        {/* 로고 클릭 시 메인페이지로 이동하도록 */}
        <div className="flex items-center justify-end">
          {user ? (
            <div>
              <span>안녕하세요, {user.email.split("@")[0]}님!</span>
              <Link to="/mypage">마이페이지(top)</Link>
              <LogoutButton className="logout-btn" />
            </div>
          ) : (
            <div>
              <Link to="/login" className="login-btn">
                로그인
              </Link>
              <span> / </span>
              <Link to="/signup" className="signup-btn">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
