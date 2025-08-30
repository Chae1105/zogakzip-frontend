import { useState, useEffect } from "react";
import { fetchUserDetail } from "../services/userService";
import { auth } from "../firebase";

function UserInfo({ userId }) {
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    console.log("useEffect 실행");
    async function fetchUserData() {
      try {
        console.log("함수 정의 부분 들어옴");
        const userData = await fetchUserDetail(userId);
        setUser(userData);
      } catch (err) {
        console.error("유저 정보 불러오기 실패: ", err);
      }
    }

    console.log("userId 있는지 확인하기");
    if (userId) {
      fetchUserData();
    }
  }, []);

  if (!user) return <div>회원 정보 로딩 중...</div>;

  return (
    <div>
      <div className="flex-row">
        <div className="flex-col">
          <img
            src={user.imageUrl || null}
            alt="유저 프로필 사진"
            className="w-50 h-50"
          />
          <button>정보 수정하기</button>
        </div>

        <div className="flex-col">
          <p>이름 : {user.userName}</p>
          <p>이메일 : {user.email}</p>
          <p>비밀번호 : {user.password}</p>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;

/*
useEffect(() => {
    async function fetchGroupData() {
      try {
        const groupData = await fetchGroupDetail(groupId);
        setGroup(groupData);
        console.log("그룹 정보: ", groupData);
      } catch (err) {
        console.error("그룹 정보 불러오기 실패:  ", err);
      } finally {
        setLoading(false);
      }
    }

    // 그룹Id 있는지 확실하게 확인 후 해당 그룹 데이터 가져오기
    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);
*/
