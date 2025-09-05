// 댓글 수정 및 삭제 버튼 존재
// 해당 동작 수행하려면 groupId, postId, userId 필요
// postDetailPage에서 groupId랑 postId 받음
// CommentList.jsx 만들어서 여기에 Comment 나열, groupId랑 postId도 받기
// firestore: groups -> posts -> comments(userId, content, createdAt)
// 댓글 리스트 에 이거 나열,
// userId말고 유저 이름을 가져오는게? 그럼 fetchUser를 매번 해줘야 하는데,
// 유저가 이름 변경하면 그것도 일일이 반영을 해줘야 함. 그럼 fetchUser 해주는게 나을지도?
// '수정하기' 누르면 content 보여주는 부분이 input 창 + 버튼으로 바뀌도록?
// CommentList에서 commentData 넘겨줄 때, commentId = doc.id 로 데이터 추가 후 넘기기

import { useState } from "react";
import dayjs from "dayjs";
import { deleteComment, updateComment } from "../services/commentService";
import { auth } from "../firebase";

function Comment({ groupId, postId, commentData, onCommentDeleted }) {
  const [comment, setComment] = useState(commentData);
  const [content, setContent] = useState(commentData.content);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdateComment = async () => {
    if (!groupId || !postId || !commentData) {
      console.error("알 수 없는 오류 발생");
      return;
    }

    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요!");
      return;
    }

    setIsUpdating(true);

    try {
      console.log("comment, 수정 시작");
      await updateComment(groupId, postId, commentData.commentId, {
        content: content,
      });
      console.log("댓글 수정 성공");
      alert("댓글 수정에 성공했습니다");
      setIsUpdating(false);
    } catch (err) {
      console.error("댓글 수정 실패: ", err);
      alert("댓글 수정에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteComment = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteComment(
        auth.currentUser.uid,
        groupId,
        postId,
        commentData.commentId,
        commentData
      );
      if (result) {
        console.log("댓글 삭제 성공");

        // 부모 컴포넌트에 삭제된 댓글 ID 전달
        if (onCommentDeleted) {
          onCommentDeleted(commentData.commentId);
        }

        setIsDeleteModalOpen(false);
        alert("댓글 삭제 성공!");
      } else {
        alert("댓글 삭제 실패!");
      }
    } catch (err) {
      console.error("댓글 삭제 실패: ", err);
      alert("댓글 삭제 실패!");
    } finally {
      setIsDeleting(false);
    }
  };

  // 수정 취소 시 원래 내용으로 되돌리기
  const handleCancelUpdate =() => {
    setContent(commentData.content); 
    setIsUpdating(false);
  }

  // 날짜 포맷용 함수
  const formatCreatedAt = (createdAt) => {
    if (!createdAt) return "정보 없음";
    if (typeof createdAt.toDate === "function") {
      return dayjs(createdAt.toDate()).format("YYYY-MM-DD");
    }
    return createdAt; // 이미 포맷이 된 형태라면 그냥 리턴
  };

  return (
    <div>
      <div>
        <p>이름: {commentData.userName}</p>
        <p>날짜: {formatCreatedAt(commentData.createdAt)}</p>
        {isUpdating ? (
          <div>
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <button
              onClick={handleCancelUpdate}
            >
              취소
            </button>
            <button onClick={handleUpdateComment}>댓글 수정</button>
          </div>
        ) : (
          <div>
            <p>본문: {content}</p>
            <button onClick={() => setIsUpdating(true)}>수정하기</button>
            <button onClick={() => setIsDeleteModalOpen(true)}>삭제하기</button>
          </div>
        )}
        {isDeleteModalOpen && (
          <div>
            <div>
              <p>댓글 삭제하기</p>
              <button onClick={() => setIsDeleteModalOpen(false)}>X</button>
            </div>

            <p>정말 삭제하시겠습니까?</p>

            <div>
              <button onClick={() => setIsDeleteModalOpen(false)}>취소</button>
              <button onClick={handleDeleteComment}>
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
