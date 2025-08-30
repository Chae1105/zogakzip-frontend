// 기능 테스트 위한 초기 데이터 삽입
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  setDoc,
} from "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfigInScript = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: process.env.VITE_AUTH_DOMAIN,
  projectId: process.env.VITE_PROJECT_ID,
  storageBucket: process.env.VITE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_APP_ID,
  measurementId: process.env.VITE_MEASUREMENT_ID,
};

const appInScript = initializeApp(firebaseConfigInScript);
const dbInScript = getFirestore(appInScript);

const addInitialGroup1 = async () => {
  try {
    const docRef = await addDoc(collection(dbInScript, "groups"), {
      groupName: "firstGroup",
      groupPassword: "firstpassword",
      imageUrl: "string",
      isPublic: true,
      introduction: "초기 그룹 데이터 추가용",
      members: ["firstUser"],
      likeCount: 0,
      postCount: 0,
      createdAt: "2025-08-26",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const addInitialGroup2 = async () => {
  try {
    const docRef = await addDoc(collection(dbInScript, "groups"), {
      groupName: "secondGroup",
      groupPassword: "secondpassword",
      imageUrl: "string",
      isPublic: true,
      introduction: "초기 그룹 데이터 추가용222",
      members: ["secondUser"],
      likeCount: 0,
      postCount: 0,
      createdAt: "2025-08-26",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

addInitialGroup1();
addInitialGroup2();
