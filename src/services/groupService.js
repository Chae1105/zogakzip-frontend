// 그룹 관련 기능 함수들 구현

// 그룹 생성 -> 데이터 삽입, addDoc()으로, 매개변수 = groupInfo 객체
// 그룹 수정 -> 데이터 수정, setDoc()으로, {merge:true} 이거 블로그에 정리한대로, 매개변수 = groupId
// 그룹 삭제 -> 데이터 삭제, deleteDoc
// 그룹 상세 정보 -> fetchGroup 함수 보기, getDocs() 함수
// 비밀번호 검증

import { db } from "../firebase";
import {
  doc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export const createGroup = async (groupData) => {
  try {
    const result = await addDoc(collection(db, "groups"), {
      ...groupData,
      likeCount: 0,
      postCount: 0,
      createdAt: serverTimestamp(), // Firestore가 저장 순간의 서버 시간을 넣어줌
    });
    return result;
  } catch (err) {
    console.error("그룹 생성 실패: ", err);
  }
};

export const updateGroup = async (groupData, groupId) => {
  try {
    console.log("수정시작", groupId);
    const result = await setDoc(doc(db, "groups", groupId), groupData, {
      merge: true,
    });
    return result;
  } catch (err) {
    console.error("그룹 정보 수정 실패: ", err);
  }
};

// setDoc(cityRef, { capital: true, likeCount: 3 }, { merge: true });
