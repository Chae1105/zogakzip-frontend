// 유저 관련 함수들 구현

import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { deleteImage } from "./fileService";

// 유저 생성 -> 회원가입 페이지, addDoc
// 유저 수정 -> 닉네임, 비밀번호, 이미지, setDoc()
// 유저 삭제 -> 회원탈퇴 (아직 구현X)
// 유저 상세 정보 -> getDocs,

// 유저 정보 생성
export const createUser = async (userId, userData) => {
  try {
    console.log("유저 데이터: ", userData, userId);
    const result = await setDoc(doc(db, "users", userId), {
      ...userData,
      userName: userData.email.split("@")[0],
      imageUrl: "",
    });
    return result;
  } catch (err) {
    console.error("유저 정보 저장 실패: ", err);
    throw err;
  }
};

// 유저 상세 정보 불러오기
export const fetchUserDetail = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (!userDoc.exists()) {
      throw new Error("해당 유저를 찾을 수 없습니다.");
    }
    const userData = userDoc.data();
    return userData;
  } catch (err) {
    console.error("유저 정보 불러오기 실패: ", err);
    throw err;
  }
};

// 유저 정보 수정
export const updateUser = async (userId, userData) => {
  try {
    const result = setDoc(doc(db, "users", userId), userData, { merge: true });
    return result;
  } catch (err) {
    console.error("유저 정보 수정 실패: ", err);
    throw err;
  }
};

// 유저 정보 삭제
export const deleteUserData = async (userId, userData) => {
  try {
    // 유저 이미지가 있으면 storage에서 해당 파일 삭제
    if (userData.imageUrl) await deleteImage(userData.imageUrl);
    await deleteDoc(doc(db, "users", userId));
    return true;
  } catch (err) {
    console.error("유저 정보 삭제 실패: ", err);
  }
};
