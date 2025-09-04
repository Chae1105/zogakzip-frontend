import { useEffect, useState } from "react";
import { createComment, fetchCommentDocs } from "../services/commentService";
import Comment from "./Comment";
import { auth } from "../firebase";

// 댓글 목록 겸 댓글 생성 기능 (댓글 생성은 모달창에 X)

function CommentList({ groupId, postId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 댓글 생성을 위한 본문 상태
  const [content, setContent] = useState("");

  useEffect(() => {
    async function fetchComments() {
      try {
        const allComments = await fetchCommentDocs(groupId, postId);
        const commentsData = allComments.docs.map((doc) => ({
          commentId: doc.id,
          ...doc.data(),
        }));
        setComments(commentsData);
      } catch (err) {
        console.error("댓글 불러오기 실패: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [comments]);

  // 댓글 생성하기, userId, groupId, postId, commentData
  const handleCreateComment = async () => {
    try {
      await createComment(auth.currentUser.uid, groupId, postId, content);
      console.log("댓글 생성 완료");
      alert("댓글 생성 완료!");
    } catch (err) {
      console.error("댓글 생성 실패: ", err);
      alert("댓글 생성 실패!");
    }
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
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            groupId={groupId}
            postId={postId}
            commentData={comment}
          />
        ))}
      </div>
    </div>
  );
}

export default CommentList;
