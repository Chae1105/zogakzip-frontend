import React from "react";
import { useState, useEffect } from "react";
import { fetchUserDetail } from "../services/userService";
import { auth } from "../firebase";
import UserInfo from "../components/UserInfo";
import { useAuth } from "../hooks/useAuth";

function MyPage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState();

  /*
  console.log("현재 로그인한 사용자: ", auth.currentUser);
  const userId = user.uid;
  console.log("유저 아이디: ", userId);
  */

  // fetchUserDeatil은 여기서 구현, 그 return 값인 userData를
  // 각각의 컴포넌트들에게 넘겨주기
  useEffect(() => {
    console.log("MyPage, useEffect 실행");

    async function fetchUserData() {
      try {
        const result = await fetchUserDetail(user.uid);
        console.log("유저 데이터: ", result);
        setUserData(result);
      } catch (err) {
        console.error("유저 정보 불러오기 실패: ", err);
      }
    }

    if (user?.uid) {
      console.log("fetchUserData 함수 실행");
      fetchUserData();
    } else {
      console.error("유저 ID가 존재하지 않습니다.");
    }
  }, [user?.uid]);

  if (loading) return <div>로딩 중...</div>;
  if (!user) return <div>로그인이 필요합니다.</div>;

  return (
    <div>
      <div>
        <h2>마이페이지</h2>
      </div>

      <UserInfo userId={user.uid} userInfo={userData} />
    </div>
  );
}

export default MyPage;
