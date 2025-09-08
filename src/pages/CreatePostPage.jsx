import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createPost } from "../services/postService";
import { auth } from "../firebase";
import { deleteImage, uploadImage } from "../services/fileService";
import { useState, useEffect } from "react";
import { fetchGroupDetail, updateGroup } from "../services/groupService";

function CreatePostPage() {
  const { groupId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [memoryPlace, setMemoryPlage] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 태그 관련
  const [inputTag, setInputTag] = useState("");
  const [tagList, setTagList] = useState([]);

  // 게시글 생성 후 그룹 상세 페이지 이동
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (isUploading) {
      alert("이미지 업로드가 진행 중입니다. 잠시 후 다시 시도해주세요!");
      return;
    }

    // 이미지 업로드 완료 시 게시글 생성 진행
    setIsUploading(true);

    let newImageUrl = imageUrl;

    try {
      if (selectedFile) {
        if (imageUrl) {
          await deleteImage(imageUrl);
        }

        newImageUrl = await uploadImage(selectedFile, "posts");
        setImageUrl(newImageUrl);
      }

      const postData = {
        userId: auth.currentUser.uid,
        title,
        content,
        imageUrl: newImageUrl,
        memoryPlace,
        tags: tagList,
      };

      const response = await createPost(groupId, postData);
      if (response) {
        // 게시글 생성 완료 시 group의 postCount 증
        const groupData = await fetchGroupDetail(groupId);
        await updateGroup(
          { ...groupData, postCount: groupData.postCount + 1 },
          groupId
        );
        alert("게시글 생성 완료!");
        navigate(`/groups/${groupId}`);
      } else {
        alert("그룹 생성에 실패했습니다. 다시 시도해주세요!");
      }
    } catch (err) {
      console.error("게시글 생성 중 오류 발생: ", err);
      alert("게시글 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  // 이미지 미리보기
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

  // 이미지 파일 업로드
  const handleUploadImage = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    // 파일 크기 확인
    if (imageFile.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요");
      return;
    }

    setIsUploading(true);

    try {
      console.log("게시글 이미지 업로드 시작: ", imageFile.name);
      const fileUrl = await uploadImage(imageFile, "posts");

      if (fileUrl) {
        console.log("업로드된 파일 URL: ", fileUrl);
        setImageUrl(fileUrl);
      } else {
        throw new Error("파일 URL을 받지 못했습니다.");
      }
    } catch (err) {
      console.error("이미지 업로드 실패: ", err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요!");
      setImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h1>게시글 생성</h1>

      <form onSubmit={handleCreatePost}>
        <div>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력해주세요"
            required
          />
        </div>

        <div>
          <label>이미지</label>
          <img
            src={previewUrl || null}
            alt="게시글 이미지"
            className="w-50 h-50 object-contain"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {isUploading && <p>이미지 업로드 중...</p>}{" "}
          {imageUrl && !isUploading && <p>이미지 업로드 완료!</p>}
        </div>

        <div>
          <label>본문</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="본문을 입력해주세요"
            required
          />
        </div>

        <div>
          <label>추억의 장소</label>
          <input
            value={memoryPlace}
            onChange={(e) => setMemoryPlage(e.target.value)}
            placeholder="추억의 장소를 입력해주세요"
          />
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
          <button type="button" onClick={() => navigate(`/groups/${groupId}`)}>
            취소
          </button>
          <button type="submit">생성하기</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostPage;
