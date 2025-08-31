import React from "react";
import { useState } from "react";
import { fetchUserDetail } from "../services/userService";
import { auth } from "../firebase";
import UserInfo from "../components/UserInfo";
import { useAuth } from "../hooks/useAuth";

function MyPage() {
  const { user, loading } = useAuth();

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  //console.log("현재 로그인한 사용자: ", auth.currentUser);
  const userId = user.uid;
  //console.log("유저 아이디: ", userId);

  // fetchUserDeatil은 여기서 구현, 그 return 값인 userData를
  // 각각의 컴포넌트들에게 넘겨주기

  return (
    <div>
      <div>
        <h2>마이페이지</h2>
      </div>

      <UserInfo userId={userId} />
    </div>
  );
}

export default MyPage;
