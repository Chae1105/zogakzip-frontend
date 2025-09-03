// GroupDetailPage에서 groupId 받아오기

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPostDetail } from "../services/postService";
import dayjs from "dayjs";
import PostUpdateModal from "../components/PostUpdateModal";

// 경로 = /groups/:groupId/:postId
// 여기서 게시글 정보 불러오기 및 게시글 수정 모달 open
function PostDetailPage() {
  const { groupId, postId } = useParams();
  console.log(`게시글 상세 페이지, groupId: ${groupId}, postId: ${postId}`);

  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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

      
    </div>
  );
}

export default PostDetailPage;
