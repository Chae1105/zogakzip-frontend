import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import GroupCard from "../components/GroupCard";
import { Link } from "react-router-dom";

// 그룹 전체보기 버튼 -> 그룹 목록 페이지 이동
// 그룹 조건별 top3 보여주기
// 좋아요 순, 멤버순(그룹 데이터에 멤버수 필드 추가 필요), 게시글 순 정도만
// 그룹 전체 컬렉션 불러와서 저장하는 데이터 1
// 조건별 그룹 데이터 3개씩만 저장
// GroupCard로 나열

function HomePage() {
  const groupsRef = collection(db, "groups");

  const likeQuery = query(groupsRef, orderBy("likeCount", "desc"), limit(3));
  const postQuery = query(groupsRef, orderBy("postCount", "desc"), limit(3));
  const memberQuery = query(
    groupsRef,
    orderBy("memberCount", "desc"),
    limit(3)
  );

  const [topLikedGroups, setTopLikedGroups] = useState([]);
  const [topPostGroups, setTopPostGroups] = useState([]);
  const [topMemberGroups, setTopMemberGroups] = useState([]);

  useEffect(() => {
    console.log("mainPage useEffect");
    const fetchGroupList = async () => {
      try {
        const likeQuerySnapshot = await getDocs(likeQuery);
        const likeQueryGroupsData = likeQuerySnapshot.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        }));
        setTopLikedGroups(likeQueryGroupsData);

        const postQuerySnapshot = await getDocs(postQuery);
        const postQueryGroupsData = postQuerySnapshot.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        }));
        setTopPostGroups(postQueryGroupsData);

        const memberQuerySnapshot = await getDocs(memberQuery);
        const memberQueryGroupsData = memberQuerySnapshot.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        }));
        setTopMemberGroups(memberQueryGroupsData);
      } catch (err) {
        console.error("그룹 조건별 리스트 목록 패치 실패: ", err);
      }
    };

    fetchGroupList();
  }, []);

  return (
    <div>
      <p>메인 페이지</p>
      <Link to="/groups">게시글 전체 목록</Link>
      <div>
        <p>좋아요 Top 3</p>
        <div className="flex">
          {topLikedGroups.map((group) => (
            <GroupCard key={group.groupId} groupInfo={group} />
          ))}
        </div>
      </div>

      <div>
        <p>게시글 수 Top 3</p>
        <div className="flex">
          {topPostGroups.map((group) => (
            <GroupCard key={group.groupId} groupInfo={group} />
          ))}
        </div>
      </div>

      <div>
        <p>멤버 수 Top 3</p>
        <div className="flex justify-between">
          {topMemberGroups.map((group) => (
            <GroupCard key={group.groupId} groupInfo={group} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
