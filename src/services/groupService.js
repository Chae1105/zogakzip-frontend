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
import { deleteImage } from "./fileService";

// 그룹 생성
export const createGroup = async (groupData) => {
  try {
    const result = await addDoc(collection(db, "groups"), {
      ...groupData,
      memberCount: groupData.members.length,
      likeCount: 0,
      postCount: 0,
      createdAt: serverTimestamp(), // Firestore가 저장 순간의 서버 시간을 넣어줌
    });
    return result;
  } catch (err) {
    console.error("그룹 생성 실패: ", err);
    throw err;
  }
};

// 그룹 상세 정보 불러오기
export const fetchGroupDetail = async (groupId) => {
  try {
    const groupDoc = await getDoc(doc(db, "groups", groupId));
    if (!groupDoc.exists()) {
      throw new Error("해당 그룹을 찾을 수 없습니다.");
    }
    const groupData = groupDoc.data();
    console.log("그룹 정보: ", groupData);

    return groupData;
  } catch (err) {
    console.error("그룹 불러오기 실패: ", err);
    throw err;
  }
};

// 그룹 수정
export const updateGroup = async (updateData, groupId) => {
  try {
    console.log("수정시작: ", groupId);
    const result = await setDoc(
      doc(db, "groups", groupId),
      { ...updateData, memberCount: updateData.members.length },
      {
        merge: true,
      }
    );
    return result;
  } catch (err) {
    console.error("그룹 정보 수정 실패: ", err);
    throw err;
  }
};

// setDoc(cityRef, { capital: true, likeCount: 3 }, { merge: true });

// 그룹 삭제 - deleteDoc(doc(db, "cities", "DC"));
export const deleteGroup = async (groupId, inputPassword, groupData) => {
  try {
    if (inputPassword !== groupData.groupPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // 그룹 이미지가 있으면 storage에서 해당 파일 삭제
    if (groupData.imageUrl) await deleteImage(groupData.imageUrl);
    await deleteDoc(doc(db, "groups", groupId)); // deletDoc이 undefined를 반환함
    return true; // 삭제 성공 시 true 반환하도록
  } catch (err) {
    console.error("그룹 삭제 실패: ", err);
    throw err;
  }
};
