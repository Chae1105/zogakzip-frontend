import { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 인증 상태를 확인 중인지 여부

  // Firebase 에러 메시지를 한국어로 변환하는 함수
  const getKoreanErrorMessage = (errorCode) => {
    const errorMessages = {
      // 로그인 관련 에러
      "auth/user-not-found": "등록되지 않은 이메일입니다.",
      "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
      "auth/missing-password": "비밀번호를 입력해 주세요.",
      "auth/invalid-email": "유효하지 않은 이메일 형식입니다.",
      "auth/user-disabled": "비활성화된 계정입니다.",
      "auth/too-many-requests":
        "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.",

      // 회원가입 관련 에러
      "auth/email-already-in-use": "이미 사용 중인 이메일입니다.",
      "auth/weak-password": "비밀번호가 너무 약합니다. 6자 이상 입력해주세요.",
      "auth/operation-not-allowed":
        "이메일/비밀번호 계정이 활성화되지 않았습니다.",

      // 네트워크 관련 에러
      "auth/network-request-failed": "네트워크 연결을 확인해주세요.",
      "auth/internal-error":
        "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",

      // 기타
      "auth/invalid-credential": "잘못된 로그인 정보입니다.",
      "auth/account-exists-with-different-credential":
        "다른 로그인 방법으로 이미 가입된 계정입니다.",
    };

    return errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다.";
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // 인증 상태 확인 완료
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("Firebase 원본 에러: ", err.code, err.message);
      throw new Error(getKoreanErrorMessage(err.code));
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("Firebase 원본 에러: ", err.code, err.message);
      throw new Error(getKoreanErrorMessage(err.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.log("로그아웃 에러: ", err.code, err.message);
      throw new Error("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return { user, loading, login, signup, logout };
};
