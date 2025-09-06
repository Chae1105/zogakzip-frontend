import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

function LogoutButton({ className = "", children = "로그아웃" }) {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false); // 버튼 중복 클릭 방지 위해

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      console.log("로그아웃 성공!");

      // 로그아웃 시 페이지 자동으로 새로고침 안되는 문제 임시 해결 방법.
      // 나중에 최상위 컴포넌트에서 firebase의 onAuthStateChanged 사용하
      window.location.reload(); 
    } catch (err) {
      console.error("로그아웃 실패: ", err.message);
      alert("로그아웃 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleLogout} disabled={loading} className={className}>
      {loading ? "로그아웃 중..." : children}
    </button>
  );
}

export default LogoutButton;
