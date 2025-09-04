// GroupDetailPage에서 groupId 받아오기

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deletePost, fetchPostDetail } from "../services/postService";
import dayjs from "dayjs";
import PostUpdateModal from "../components/PostUpdateModal";
import { auth } from "../firebase";
import CommentList from "../components/CommentList";

// 경로 = /groups/:groupId/:postId
// 여기서 게시글 정보 불러오기 및 게시글 수정 모달 open
function PostDetailPage() {
  const { groupId, postId } = useParams();
  console.log(`게시글 상세 페이지, groupId: ${groupId}, postId: ${postId}`);

  const [post, setPost] = useState({});
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

  useEffect(() => {
    async function fetchPostData() {
      try {
        const postData = await fetchPostDetail(groupId, postId);
        setPost(postData);
        console.log("게시글 정보: ", postData);
      } catch (err) {
        console.error("게시글 정보 불러오기 실패: ", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (groupId && postId) {
      fetchPostData();
    }
  }, [postId]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      console.log("현재 사용자: ", auth.currentUser.uid);
      console.log("게시글 작성자: ", post.userId);
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

  if (isLoading) return <div>게시글 로딩 중...</div>;

  return (
    <div>
      <p>게시글 상세 페이지</p>

      <div>
        <button onClick={() => setIsUpdateModalOpen(true)}>게시글 수정</button>
        <button onClick={() => setIsDeleteModalOpen(true)}>게시글 삭제</button>
      </div>

      <div>
        <p>제목: {post.title}</p>
        <p>작성자: {post.userId}</p>
        <p>작성 날짜: {formatCreatedAt(post.createdAt)}</p>
        <p>추억의 장소: {post.memoryPlace}</p>
        <p>공감수: {post.likeCount}</p>
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
        <CommentList groupId={groupId} postId={postId} />
      </div>
    </div>
  );
}

export default PostDetailPage;
