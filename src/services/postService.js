// 게시글 관련 CRUD 구현 -> 그룹과 동일
// 게시글 생성 - 데이터 삽입, addDoc(db, "posts"), postData 매개변수
// 게시글 수정 - setDoc, {merge : true}
// 게시글 삭제 - deleteDoc, postId
// 게시글 상세 정보 -> getDoc

import { db } from "../firebase";
import { deleteImage } from "./fileService";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

// 게시글 생성
export const createPost = async (postData) => {
  try {
    console.log("postService");
    const result = await addDoc(collection(db, "posts"), {
      ...postData,
      likeCount: 0,
      createdAt: serverTimestamp(),
    });
    console.log("postService, result: ", result);
    return result;
  } catch (err) {
    console.error("게시글 생성 실패: ", err);
    throw err;
  }
};

// 게시글 불러오기
export const fetchPostDetail = async (postId) => {
  try {
    const postDoc = getDoc(doc(db, "posts", postId));
    if (!postDoc.exists()) {
      throw new Error("해당 게시글을 찾을 수 없습니다.");
    }
    const postData = (await postDoc).data();
    console.log("게시글 정보: ", postData);
    return postData;
  } catch (err) {
    console.error("게시글 불러오기 실패: ", err);
    throw err;
  }
};

// 게시글 수정
export const updatePost = async (postId, postData) => {
  try {
    console.log("게시글 수정 시작");
    const result = setDoc(doc(db, "posts", postId), postData, { merge: true });
    return result;
  } catch (err) {
    console.error("게시글 수정 실패: ", err);
    throw err;
  }
};

// 게시글 삭제
export const deletePost = async (userId, postId, postData) => {
  try {
    if (userId !== postId.userId) {
      throw new Error("게시글을 삭제할 권한이 없습니다.");
    }

    // 게시글 이미지가 있으면 storag에서 해당 파일 삭제
    if (postData.imageUrl) await deleteImage(postData.imageUrl);
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (err) {
    console.error("게시글 삭제 실패: ", err);
    throw err;
  }
};
