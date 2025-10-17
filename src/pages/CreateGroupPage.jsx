import { createGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteImage, uploadImage } from "../services/fileService";
import { auth } from "../firebase";
import imageCompression from "browser-image-compression";

function CreateGroupPage() {
  // 이 페이지 들어오고 나서 새로고침을 하면 auth.currentUser.uid가 null이 됨
  // 이 문제를 해결하기 위한 상태 설정
  const [userId, setUserId] = useState();
  const [authLoading, setAuthLoading] = useState(true);

  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // 이미지 미리보기
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 태그 기능
  const [inputTag, setInputTag] = useState("");
  const [tagList, setTagList] = useState([]);
  // 태그 인풋창 데이터 = inputTag
  // form 안에 태그 리스트 미리보기 = tagList

  const [isUploading, setIsUploading] = useState(false); // 이미지 파일 업로드 상태 관리
  const [isCreating, setIsCreating] = useState(false); // 그룹 생성 상태 관리
  const [isCompressing, setIsCompressing] = useState(false); // 이미지 압축 상태

  const navigate = useNavigate(); // 그룹 생성 후 메인페이지 이동 (일단은)

  // 사용자 인증 확인 -> auth.currentUser가 존재하는지 확인하기 위해
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user?.uid || null);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // 이미지 미리보기 관련 useEffect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 그룹 생성 함수 - 이미지 업로드 완료 후에 실행하도록
  const handleCreateGroup = async () => {
    /*
    if (isUploading) {
      alert("이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요!");
      return;
    }
      */
    setIsCreating(true); // 이미지 업로드 완료 시 그룹 생성 과정 진행하기

    let newImageUrl = imageUrl;

    try {
      if (selectedFile) {
        if (imageUrl) {
          await deleteImage(imageUrl);
          console.log("그룹 기존 이미지 삭제 완료");
        }

        newImageUrl = await uploadImage(selectedFile, "groups");
        setImageUrl(newImageUrl);
        console.log("새 이미지 업로드 완료");
      }
      const groupData = {
        groupName,
        groupPassword,
        introduction,
        imageUrl: newImageUrl,
        isPublic,
        members: [userId],
        createdBy: userId,
        tags: tagList,
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setIsCompressing(true);

    // 이미지 파일 압축
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1920,
      }); // 최대 300KB로

      // 압축 확인
      console.log("원본: ", file.size);
      console.log("압축 후: ", compressedFile.size);
      console.log("사용자 확인: ", auth.currentUser);

      setSelectedFile(compressedFile); // 압축된 파일을 저장
      setPreviewUrl(URL.createObjectURL(compressedFile));
      setIsCompressing(false);
    } catch (err) {
      console.error("압축 실패: ", err);
      alert("이미지 압축 처리 실패");
    }
  };

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

  if (authLoading) return <div>로딩 중...</div>;
  if (!userId) return alert("로그인이 필요합니다!");

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
        <div>
          <img
            src={previewUrl || null}
            alt="그룹 이미지"
            className="w-50 h-50 object-contain"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && <p>이미지 업로드 중... </p>}
          {imageUrl && <p>이미지 업로드 완료!</p>}
          {isCompressing && <p>이미지 압축 중...</p>}
        </div>
        <div>
          <label>태그</label>

          <input
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setTagList([...tagList, inputTag]);
              setInputTag("");
            }}
          >
            태그추가
          </button>
          <div className="flex">
            {tagList &&
              tagList.map((tag) => (
                <div key={tag} className="flex">
                  <p># {tag} </p>
                  <button
                    onClick={() => {
                      const newTags = tagList.filter(
                        (saveTag) => saveTag !== tag
                      );
                      setTagList([...newTags]);
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
          </div>
        </div>

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
