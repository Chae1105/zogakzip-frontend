import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // 사용자 인증
import { getFirestore } from "firebase/firestore"; // 문서 데이터 저장 위해(유저, 그룹, 게시글)
import { getStorage } from "firebase/storage"; // 파일 데이터 저장

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

export const auth = getAuth(app); // 로그인/회원가입
export const db = getFirestore(app); // 데이터 관련
export const storage = getStorage(app); // 이미지 파일 위해

export default app;
