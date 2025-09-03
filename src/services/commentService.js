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
export const createComment = async (userId, postId, commentData) => {
  try {
    const result = await addDoc(collection(db, "posts", postId, "comments"), {
      ...commentData,
      writer: userId,
      createdAt: serverTimestamp(),
    });
    return result;
  } catch (err) {
    console.error("댓글 생성 실패: ", err);
    throw err;
  }
};

// 댓글 불러오기 - 게시글 상세 페이지에서 정보 불러온 후 map메소드 이용
export const fetchCommentDocs = async (postId) => {
  try {
    const commentDocs = await getDocs(doc(db, "posts", postId, "comments"));
    if (!commentDocs.exists()) {
      throw new Error("작성된 댓글이 없습니다");
    }
    return commentDocs;
  } catch (err) {
    console.error("댓글 불러오기 실패: ", err);
    throw err;
  }
};

// 댓글 수정
export const updateComment = async (commentId, commentData) => {
  try {
    console.log("댓글 수정 시작");
    const result = await setDoc(
      doc(db, "posts", postId, "comments"),
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
export const deleteComment = async (userId, postId, commentId, commentData) => {
  try {
    if (userId !== commentData.writer) {
      throw new Error("댓글을 삭제할 권한이 없습니다.");
    }

    await deleteDoc(doc(db, "posts", postId, "comments", commentId));
    return true;
  } catch (err) {
    console.error("댓글 삭제 실패: ", err);
    throw err;
  }
};
