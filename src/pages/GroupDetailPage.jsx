import GroupUpdateModal from "../components/GroupUpdateModal";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DeleteModal from "../components/DeleteModal";
import { fetchGroupDetail, updateGroup } from "../services/groupService";
import PostList from "../components/PostList";

function GroupDetailPage() {
  //const groupId = useParams().groupId;
  const { groupId } = useParams(); // 구조 분해 할당으로 변경
  const navigate = useNavigate();

  const [group, setGroup] = useState({});
  const [likeCount, setLikeCount] = useState(group.likeCount || 0);

  const [loading, setLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 그룹에 가입한 멤버인지 확인
  const [isGroupMember, setIsGroupMember] = useState(false);

  // 그룹을 만든 사람인지 확인
  const [isGroupCreator, setIsGroupCreator] = useState(false);

  // 날짜 포맷용 함수
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "정보 없음";
    if (typeof createdAt.toDate === "function") {
      return dayjs(createdAt.toDate()).format("YYYY-MM-DD");
    }
    return createdAt; // 이미 포맷이 된 형태라면 그냥 리턴
  };

  // 상세 페이지 렌더링 - 여기 fetch 함수 모듈화/공통 함수 유틸화
  useEffect(() => {
    console.log("GroupDetailPage useEffect");
    async function fetchGroupData() {
      try {
        const groupData = await fetchGroupDetail(groupId);
        setGroup(groupData);
        setLikeCount(groupData.likeCount);
        console.log("그룹 정보: ", groupData);

        if (groupData.members.includes(auth.currentUser?.uid)) {
          setIsGroupMember(true);
        }

        if (groupData.createdBu === auth.currentUser?.uid) {
          setIsGroupCreator(true);
        }
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
  }, [likeCount, groupId]);

  const handleClickLike = async () => {
    try {
      const newCount = group.likeCount + 1;
      await updateGroup({ ...group, likeCount: newCount }, groupId);
      setLikeCount(newCount);
      alert("좋아요 누르기 성공!");
    } catch (err) {
      console.error("좋아요 누르기 실패");
    }
  };

  // 그룹 가입하기
  const handleJoinGroup = async () => {
    if (!auth.currentUser) {
      alert("회원만 가능한 기능입니다!");
      return;
    }

    try {
      await updateGroup(
        { ...group, members: [...group.members, auth.currentUser.uid] },
        groupId
      );
      setIsGroupMember(true);
      console.log("그룹 가입 성공");
      alert("그룹 가입에 성공했습니다!");
    } catch (err) {
      console.error("그룹 가입 실패: ", err);
      alert("그룹 가입에 실패했습니다. 다시 시도해주세요");
    }
  };

  // 그룹 탈퇴하기
  const handleWithdrawGroup = async () => {
    try {
      const newMembers = group.members.filter(
        (userId) => userId !== auth.currentUser.uid
      );
      await updateGroup({ ...group, members: newMembers }, groupId);
      setIsGroupMember(false);
      console.log("그룹 탈퇴 성공");
      alert("그룹 탈퇴에 성공했습니다!");
    } catch (err) {
      console.error("그룹 탈퇴 실패: ", err);
      alert("그룹 탈퇴에 실패했습니다. 다시 시도해주세요");
    }
  };

  /* 
  // 수정 모달창 닫은 후 데이터 새로고침 하기 위해
  const handleUpdateModalClose = () => {
    setIsUpdateModalOpen(false);

    // 모달창 닫히면 그룹 데이터 다시 불러오기
    
    if (groupId) {
      fetchGroupDetail();
    }
    
  };

  // 삭제 모달창 닫기
  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);

    if (groupId) {
      fetchGroupDetail();
    }
  };

  // 위 useEffect 내 함수랑 동일해서 나중에 처리 필요
  const fetchGroupDetail = async () => {
    try {
      console.log("그룹 데이터 새로고침: ", groupId);

      const groupDoc = await getDoc(doc(db, "groups", groupId));

      if (!groupDoc.exists()) {
        console.error("해당 그룹을 찾을 수 없습니다.");
        return;
      }
      const groupData = groupDoc.data();

      setGroup(groupData);
    } catch (err) {
      console.error("그룹 정보 불러오기 실패:  ", err);
    }
  }; 
   */

  if (loading) return <div>로딩 중...</div>;

  if (!group.groupName) {
    return <div>그룹을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <h2>그룹 상세 페이지</h2>
      <button onClick={handleClickLike}>공감수 증가</button>
      <div>
        {group.imageUrl && (
          <img
            src={group.imageUrl}
            alt="그룹 대표 이미지"
            className="w-60 h-60 object-contain"
          />
        )}
        <h1>그룹 이름: {group.groupName}</h1>
        <p>그룹 소개: {group.introduction}</p>
        <p>그룹 생성일: {formatCreatedAt(group.createdAt)}</p>
        <p>공개 여부: {group.isPublic ? "공개" : "비공개"}</p>
        <p>좋아요 수: {likeCount || 0}</p>
        <p>게시글 수: {group.postCount || 0}</p>
      </div>
      {!isGroupMember ? (
        <button onClick={handleJoinGroup}>그룹 가입하기</button>
      ) : (
        <button onClick={handleWithdrawGroup}>그룹 탈퇴하기</button>
      )}
      {isGroupMember && isGroupCreator && (
        <div>
          <button
            className="bg-pink-500"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            그룹 수정
          </button>
          <button
            className="bg-yellow-500"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            그룹 삭제
          </button>
        </div>
      )}
      {isGroupMember && (
        <div>
          <button onClick={() => navigate(`/groups/${groupId}/createPost`)}>
            게시글 작성하기
          </button>
        </div>
      )}
      <PostList groupId={groupId} />
      {isUpdateModalOpen && (
        <GroupUpdateModal
          group={group}
          groupId={groupId}
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          groupData={group}
          mode="그룹"
          docId={groupId}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
}

export default GroupDetailPage;
