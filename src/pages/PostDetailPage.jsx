// GroupDetailPage에서 groupId 받아오기

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deletePost,
  fetchPostDetail,
  updatePost,
} from "../services/postService";
import dayjs from "dayjs";
import PostUpdateModal from "../components/PostUpdateModal";
import { auth } from "../firebase";
import CommentList from "../components/CommentList";
import { fetchUserDetail } from "../services/userService";

// 경로 = /groups/:groupId/:postId
// 여기서 게시글 정보 불러오기 및 게시글 수정 모달 open
function PostDetailPage() {
  const { groupId, postId } = useParams();

  // 유저 이름을 게시글과 댓글의 작성자로 보여주기 위해
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [authLoading, setAuthLoading] = useState(true);

  console.log(`게시글 상세 페이지, groupId: ${groupId}, postId: ${postId}`);

  const [post, setPost] = useState({});
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  const [isLoading, setIsLoading] = useState(true);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 게시글 및 댓글 삭제 모달 공통 컴포넌트 만들면 거기로 옮기기
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // 날짜 포맷용 함수
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "정보 없음";
    if (typeof createdAt.toDate === "function") {
      return dayjs(createdAt.toDate()).format("YYYY-MM-DD");
    }
    return createdAt; // 이미 포맷이 된 형태라면 그냥 리턴
  };

  // Firebase Auth는 새로고침 시 사용자 정보를 비동기적으로 로드함
  // 컴포넌트가 마운트될 때는 아직 로드되지 않아서 auth.currentUser가 null임
  // onAuthStateChanged로 인증 상태를 기다려야 함
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      console.log("user: ", currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const postData = await fetchPostDetail(groupId, postId);
        if (!user?.uid) return;
        setPost(postData);
        setLikeCount(post.likeCount);
        const userData = await fetchUserDetail(user.uid);
        console.log("유저 정보: ", userData);
        setUserName(userData.userName);
      } catch (err) {
        console.error("게시글 정보 불러오기 실패: ", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (groupId && postId) {
      fetchPostData();
    }
  }, [user, postId, likeCount]);

  const handleClickLike = async () => {
    try {
      const newCount = post.likeCount + 1;
      await updatePost(groupId, postId, { ...post, likeCount: newCount });
      setLikeCount(newCount);
      alert("좋아요 누르기 성공!");
    } catch (err) {
      console.error("좋아요 누르기 실패: ", err);
    }
  };

  const handleDeletePost = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      console.log("현재 사용자: ", auth.currentUser.uid);
      console.log("게시글 작성자: ", userName);
      await deletePost(auth.currentUser.uid, groupId, postId, post);
      alert("게시글이 삭제되었습니다.");
      navigate(`/groups/${groupId}`);
    } catch (err) {
      console.error("게시글 삭제 실패: ", err);
      alert("게시글 삭제에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading) return <div>로딩 중...</div>;
  if (isLoading) return <div>게시글 로딩 중...</div>;

  return (
    <div>
      <p>게시글 상세 페이지</p>

      <div>
        <button onClick={() => setIsUpdateModalOpen(true)}>게시글 수정</button>
        <button onClick={() => setIsDeleteModalOpen(true)}>게시글 삭제</button>
        <button onClick={handleClickLike}>좋아요 버튼</button>
      </div>

      <div>
        <p>제목: {post.title}</p>
        <p>작성자: {userName}</p>
        <p>작성 날짜: {formatCreatedAt(post.createdAt)}</p>
        <p>추억의 장소: {post.memoryPlace}</p>
        <p>공감수: {likeCount}</p>
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="게시글 이미지"
            className="w-60 h-60 object-contain"
          />
        )}
        <p>본문: {post.content}</p>
      </div>

      {isUpdateModalOpen && (
        <PostUpdateModal
          groupId={groupId}
          postId={postId}
          post={post}
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <div>
          <div>
            <p>게시글 삭제하기</p>
            <button onClick={() => setIsDeleteModalOpen(false)}>X</button>
          </div>

          <p>정말 삭제하시겠습니까?</p>

          <div>
            <button onClick={() => setIsDeleteModalOpen(false)}>취소</button>
            <button onClick={handleDeletePost}>
              {isDeleting ? "삭제 중..." : "삭제하기"}
            </button>
          </div>
        </div>
      )}

      <div>
        <CommentList groupId={groupId} postId={postId} userName={userName} />
      </div>
    </div>
  );
}

export default PostDetailPage;
