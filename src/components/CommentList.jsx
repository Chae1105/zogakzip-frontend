import { useEffect, useState } from "react";
import { createComment, fetchCommentDocs } from "../services/commentService";
import Comment from "./Comment";
import { auth } from "../firebase";
import { fetchUserDetail } from "../services/userService";

// 댓글 목록 겸 댓글 생성 기능 (댓글 생성은 모달창에 X)

function CommentList({ groupId, postId, currentUserId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 댓글 생성을 위한 본문 상태
  const [content, setContent] = useState("");

  // 댓글 불러오기 함수를 별도로 정의하기
  const fetchComments = async () => {
    try {
      setLoading(true);

      const allComments = await fetchCommentDocs(groupId, postId);
      const commentsData = allComments.docs.map((doc) => ({
        commentId: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    } catch (err) {
      console.error("댓글 불러오기 실패: ", err);
      // 댓글이 없는 경우도 정상적으로 처리하기 위해
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  // 초기 댓글 데이터 로드하기 -> 의존성 배열에서 comments 없앴음
  useEffect(() => {
    console.log("CommentList useEffect");
    console.log("현재 유저 ID: ", currentUserId);

    if (groupId && postId) {
      fetchComments();
    }
  }, [groupId, postId]);

  // 댓글 생성하기, userId, groupId, postId, commentData
  const handleCreateComment = async () => {
    // 댓글 내용 무조건 작성하도록
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요!");
      return;
    }

    if (!currentUserId) {
      alert("회원만 가능한 기능입니다!");
      setContent("");
      return;
    }

    const userData = await fetchUserDetail(currentUserId);
    const commentData = {
      userName: userData.userName,
      content,
    };

    try {
      await createComment(currentUserId, groupId, postId, commentData);
      console.log("댓글 생성 완료");

      // 댓글 생성 후 상태 즉시 업데이트 (낙관적)
      setContent(""); // 댓글 입력창 초기화
      await fetchComments(); // 댓글 목록 새로고침하기

      alert("댓글 생성 완료!");
    } catch (err) {
      console.error("댓글 생성 실패: ", err);
      alert("댓글 생성 실패!");
    }
  };

  // 댓글 삭제 후 호출될 함수
  const handleCommentDeleted = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.commentId !== deletedCommentId)
    );
  };

  if (loading) return <div>댓글 로딩 중..</div>;

  return (
    <div>
      <h1>댓글</h1>
      <div>
        <p>댓글 작성하기</p>
        <input value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={handleCreateComment}>댓글 등록</button>
      </div>
      <div>
        {comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.commentId}
              groupId={groupId}
              postId={postId}
              commentData={comment}
              onCommentDeleted={handleCommentDeleted}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CommentList;
