import React from "react";
import { useState, useEffect } from "react";
import { fetchUserDetail } from "../services/userService";
import { auth, db } from "../firebase";
import UserInfo from "../components/UserInfo";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import GroupCard from "../components/GroupCard";
import PostCard from "../components/PostCard";

function MyPage() {
  const { user, loading } = useAuth();
  const [userData, setUserData] = useState();
  const [userGroup, setUserGroup] = useState();
  const [userPost, setUserPost] = useState();

  const [isUserInfoOpen, setIsUserInfoOpen] = useState(true);
  const [isUserGroupOpen, setIsUserGroupOpen] = useState(false);
  const [isUserPostOpen, setIsUserPostOpen] = useState(false);

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

    async function getMyData(userId) {
      try {
        const myGroups = query(
          collection(db, "groups"),
          where("members", "array-contains", userId)
        );

        const allGroups = await getDocs(myGroups);
        const groupsData = allGroups.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        }));
        setUserGroup(groupsData);
        console.log("그룹들 데이터: ", groupsData);

        const myPosts = [];

        for (const group of groupsData) {
          const posts = await getDocs(
            query(
              collection(db, "groups", group.groupId, "posts"),
              where("userId", "==", userId)
            )
          );
          const postsData = posts.docs.map((doc) => ({
            postId: doc.id,
            groupId: group.groupId,
            ...doc.data(),
          }));
          myPosts.push(...postsData);
        }
        console.log("게시글들: ", myPosts);
        setUserPost([...myPosts]);
      } catch (err) {
        console.error("내 그룹 및 게시글 정보 불러오기 실패: ", err);
      }
    }

    if (user?.uid) {
      console.log("fetchUserData 함수 실행");
      fetchUserData();
      console.log("getMyData 함수 실행");
      getMyData(user.uid);
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
      <div>
        <button
          onClick={() => {
            setIsUserGroupOpen(false);
            setIsUserPostOpen(false);
            setIsUserInfoOpen(true);
          }}
        >
          내 정보
        </button>
        <button
          onClick={() => {
            setIsUserGroupOpen(true);
            setIsUserPostOpen(false);
            setIsUserInfoOpen(false);
          }}
        >
          내 그룹
        </button>
        <button
          onClick={() => {
            setIsUserGroupOpen(false);
            setIsUserPostOpen(true);
            setIsUserInfoOpen(false);
          }}
        >
          내 게시글
        </button>
      </div>
      {isUserInfoOpen && <UserInfo userId={user.uid} userInfo={userData} />}
      {isUserGroupOpen &&
        userGroup.map((group) => (
          <GroupCard key={group.groupId} groupInfo={group} />
        ))}
      {isUserPostOpen &&
        userPost.map((post) => (
          <PostCard key={post.postId} groupId={post.groupId} postInfo={post} />
        ))}
    </div>
  );
}

export default MyPage;
