import { useEffect, useState } from "react";
import { uploadImage, deleteImage } from "../services/fileService";
import { updateGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";

function GroupUpdateModal({ group, groupId, isOpen, onClose }) {
  const navigate = useNavigate();
  console.log("그룹정보: ", group);

  const [groupName, setGroupName] = useState(group.groupName || "");
  const [groupPassword, setGroupPassword] = useState(group.groupPassword || "");
  const [introduction, setIntroduction] = useState(group.introduction || "");
  const [imageUrl, setImageUrl] = useState(group.imageUrl || "");
  const [isPublic, setIsPublic] = useState(group.isPublic ?? true);

  // 이미지 미리보기
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 태그 관련
  const [inputTag, setInputTag] = useState("");
  const [tagList, setTagList] = useState(group.tags || []);

  const [isUpdating, setIsUpdating] = useState(false); // 수정 상태 관리
  const [isImageUploading, setIsImageUploading] = useState(false); // 이미지 파일 업데이트 상태 관리

  console.log("수정 모달, 받은 groupId: ", groupId);
  console.log("수정 모달, imageUrl: ", imageUrl);

  // 이미지 미리보기 관련 useEffect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // 그룹 업데이트 함수 작성 후 수정
  const handleUpdateGroup = async (e) => {
    e.preventDefault(); // 수정 폼 제출 시 페이지 새로고침 방지 위해

    if (isImageUploading) {
      alert("이미지 업로드 진행 중.. 잠시 후 다시 시도해주세요!");
      return;
    }

    setIsUpdating(true); // 그룹 정보 수정 시작하기

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
        tags: tagList,

        likeCount: group.likeCount || 0,
        postCount: group.postCount || 0,
        createdAt: group.createdAt,
      }; // 사용자 수정 정보 외 기존 데이터는 유지

      console.log("업데이트 할 데이터: ", groupData);
      console.log("그룹 ID: ", groupId);

      await updateGroup(groupData, groupId);
      console.log("그룹 수정 완료");
      alert("그룹 정보 수정 완료!");

      onClose(); // 수정 모달창 닫기

      // 페이지 새로고침으로 변경된 데이터 반영
      window.location.reload();
    } catch (err) {
      console.error("수정 모달, 그룹 수정 실패: ", err);
      alert("그룹 수정 실패. 다시 시도해주세요.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 이미지 미리보기 함수
  const handleFileChange = (e) => {
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
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleImageUpdate = async (e) => {
    const newImage = e.target.files[0];
    if (!newImage) return;

    // 파일 크기 확인 (5MB로 제한해두기)
    if (newImage.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setIsImageUploading(true);
    console.log("새 이미지 업로드 시작: ", newImage.name);

    try {
      // 1) 새 이미지 먼저 업로드
      const newImageUrl = await uploadImage(newImage, "groups");

      if (!newImageUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      console.log("새 이미지 URL: ", newImageUrl);

      // 2) 업로드 성공 시 기존 이미지 삭제 (기존 이미지가 존재할 경우에만)
      if (imageUrl && imageUrl !== group.imageUrl) {
        try {
          await deleteImage(imageUrl); // 기존 이미지 삭제하기
          console.log("기존 이미지 삭제 완료");
        } catch (err) {
          console.error("기존 이미지 삭제 실패: ", err);
        }
      }

      // 3) imageUrl state 업데이트
      setImageUrl(newImageUrl);
    } catch (err) {
      console.error("이미지 업데이트 실패: ", err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsImageUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-sky-500">
      <div>
        <div>
          <h1>그룹 정보 수정</h1>
          <button
            className="bg-white-500"
            onClick={onClose}
            disabled={isUpdating}
          >
            X
          </button>
        </div>

        <form onSubmit={handleUpdateGroup}>
          <div>
            <label>그룹 이름</label>
            <input
              type="name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={groupPassword}
              onChange={(e) => setGroupPassword(e.target.value)}
            />
          </div>

          <div>
            <label>그룹 소개</label>
            <textarea
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              rows="3"
            />
          </div>

          <div>
            <label>그룹 이미지</label>
            <img
              src={previewUrl || imageUrl || null}
              alt="그룹 이미지"
              className="w-50 h-50 object-contain"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isImageUploading}
            />
            {/* 사용자에게 진행상황 보여주기 */}
            {isImageUploading && <p>이미지 업로드 중...</p>}{" "}
            {imageUrl && !isImageUploading && <p>이미지 업로드 완료!</p>}
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

          <div>
            <button type="button" onClick={() => setIsPublic(!isPublic)}>
              {isPublic ? "공개" : "비공개"}
            </button>
          </div>

          <div>
            <button type="button" onClick={onClose} disabled={isUpdating}>
              취소
            </button>
            <button
              type="submit"
              disabled={isUpdating || isImageUploading}
              className="bg-black-500"
            >
              {isUpdating ? "수정 중..." : "수정하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupUpdateModal;
