import { createGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { uploadImage } from "../services/fileService";

function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [isUploading, setIsUploading] = useState(false); // 이미지 파일 업로드 상태 관리
  const [isCreating, setIsCreating] = useState(false); // 그룹 생성 상태 관리

  const navigate = useNavigate(); // 그룹 생성 후 메인페이지 이동 (일단은)

  // 그룹 생성 함수 - 이미지 업로드 완료 후에 실행하도록
  const handleCreateGroup = async () => {
    if (isUploading) {
      alert("이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요!");
      return;
    }

    setIsCreating(true); // 이미지 업로드 완료 시 그룹 생성 과정 진행하기
    try {
      const groupData = {
        groupName,
        groupPassword,
        introduction,
        imageUrl,
        isPublic,
      };

      const response = await createGroup(groupData);
      if (response) {
        alert("그룹 생성 완료!");
        navigate("/groups");
      } else {
        alert("그룹 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      console.error("그룹 생성 중 오류 발생: ", err);
      alert("그룹 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false); // 그룹 생성 성공하면 다시 false로 바꾸기
    }
  };
  // -> 좀 더 에러가 발생할 수 있는 상황을 고려해 try ..catch문과 조건문, 그리고 alert문도 추가

  // 이미지 파일 업로드
  const handleUploadImage = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    // 파일 크기 확인 (5MB로 제한해두기)
    if (imageFile.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setIsUploading(true); // 이제 이미지 파일 업로드 처리 시작하기

    try {
      console.log("이미지 업로드 시작: ", imageFile.name);
      const fileUrl = await uploadImage(imageFile, "groups");

      if (fileUrl) {
        console.log("업로드된 파일 URL: ", fileUrl);
        setImageUrl(fileUrl);
      } else {
        throw new Error("파일 URL을 받지 못했습니다.");
      }
    } catch (err) {
      console.error("이미지 업로드 실패: ", err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      setImageUrl(""); // 이미지 업로드 실패 시 imageUrl 값 초기화하기
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1>그룹 생성</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="name"
          placeholder="그룹 이름"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
          required
        />
        <textarea
          placeholder="그룹 소개"
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleUploadImage}
          disabled={isUploading}
        />
        {isUploading && <p>이미지 업로드 중... </p>}
        {imageUrl && <p>이미지 업로드 완료!</p>}

        <button type="button" onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "공개" : "비공개"}
        </button>
      </form>
      <button onClick={handleCreateGroup} disabled={isCreating || isUploading}>
        {isCreating ? "생성 중..." : "생성하기"}
      </button>
    </div>
  );
}

export default CreateGroupPage;
