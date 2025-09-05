// 댓글 관련 CRUD

// 댓글 생성
// 댓글 수정
// 댓글 삭제
// 댓글 불러오기

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// 댓글 생성 - posts 컬렉션 내 comments 서브 컬렉션 형태로 저장
export const createComment = async (userId, groupId, postId, commentData) => {
  try {
    const result = await addDoc(
      collection(db, "groups", groupId, "posts", postId, "comments"),
      {
        content: commentData,
        userId: userId,
        createdAt: serverTimestamp(),
      }
    );
    return result;
  } catch (err) {
    console.error("댓글 생성 실패: ", err);
    throw err;
  }
};

// 댓글 불러오기 - 게시글 상세 페이지에서 정보 불러온 후 map메소드 이용
export const fetchCommentDocs = async (groupId, postId) => {
  try {
    const commentDocs = await getDocs(
      collection(db, "groups", groupId, "posts", postId, "comments")
    );
    if (commentDocs.empty) {
      throw new Error("작성된 댓글이 없습니다");
    }
    return commentDocs;
  } catch (err) {
    console.error("댓글 불러오기 실패: ", err);
    throw err;
  }
};

// 댓글 수정
export const updateComment = async (
  groupId,
  postId,
  commentId,
  commentData
) => {
  try {
    console.log("댓글 수정 시작");
    const result = await setDoc(
      doc(db, "groups", groupId, "posts", postId, "comments", commentId),
      commentData,
      { merge: true }
    );
    return result;
  } catch (err) {
    console.error("댓글 수정 실패: ", err);
    throw err;
  }
};

// 댓글 삭제
export const deleteComment = async (
  userId,
  groupId,
  postId,
  commentId,
  commentData
) => {
  try {
    if (userId !== commentData.userId) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }

    await deleteDoc(
      doc(db, "groups", groupId, "posts", postId, "comments", commentId)
    );
    return true;
  } catch (err) {
    console.error("댓글 삭제 실패: ", err);
    throw err;
  }
};
