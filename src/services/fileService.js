import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

// 이미지 파일 업로드
export const uploadImage = async (imageFile, folder) => {
  try {
    if (!imageFile) {
      throw new Error("업로드할 파일이 없습니다.");
    }

    console.log("이미지 파일 업로드 시작: ", imageFile);

    const fileName = `${Date.now()}_${imageFile.name}`; // 이미지 파일명 설정
    const storageRef = ref(storage, `${folder}/${fileName}`); // 경로 설정

    // 파일 업로드
    const uploadResult = await uploadBytes(storageRef, imageFile);
    console.log("파일 업로드 완료: ", uploadResult);

    // Firestore에 저장하기 위해 다운로드 URL 받기
    const downloadURL = await getDownloadURL(uploadResult.ref);
    console.log("다운로드 URL 생성 완료: ", downloadURL);

    // URL이 제대로 생성되었는지 확인
    if (!downloadURL || downloadURL === "") {
      throw new Error("다운로드 URL을 받을 수 없습니다.");
    }

    return downloadURL;
  } catch (err) {
    console.error("이미지 파일 업로드 실패: ", err);
    throw err; // 에러를 다시 throw한 뒤 호출하는 곳에서 처리할 수 있도록
  }
};

// 이미지 파일 삭제
export const deleteImage = async (imageUrl) => {
  if (!imageUrl || imageUrl === "") {
    console.log("삭제할 이미지 URL이 없습니다.");
    return;
  }

  try {
    console.log("이미지 삭제 시작: ", imageUrl);

    // imageUrl에서  파일 경로 추출
    const decodedUrl = decodeURIComponent(imageUrl);
    console.log("디코딩된 URL", decodedUrl);

    // '/o/' 다음부터 '?alt=' 전까지가 파일 경로
    // Firestore에 저장된 URL을 디코딩하면 storage에 저장된 경로와 일치
    // -> URL의 인코딩된 부분 디코딩해서 실제 파일 경로를 추출함
    const startIndex = decodedUrl.indexOf("/o/") + 3;
    const endIndex = decodedUrl.indexOf("?alt=");

    const filePath = decodedUrl.substring(startIndex, endIndex);
    console.log("추출된 파일 경로: ", filePath);

    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);

    console.log("파일 삭제 완료: ", filePath);
  } catch (err) {
    console.error("파일 삭제 실패: ", err);
  }
};
