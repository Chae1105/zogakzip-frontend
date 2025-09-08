import { useState, useEffect } from "react";
import { updatePost } from "../services/postService";
import { deleteImage, uploadImage } from "../services/fileService";

function PostUpdateModal({ groupId, postId, post, isOpen, onClose }) {
  const [postData, setPostData] = useState(post);

  const [title, setTitle] = useState(post.title);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [content, setContent] = useState(post.content);
  const [memoryPlace, setMemoryPlace] = useState(post.memoryPlace);

  // 이미지 미리보기
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // 태그 관련
  const [inputTag, setInputTag] = useState("");
  const [tagList, setTagList] = useState(post.tags);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  console.log(`게시글 수정 모달, 받은 groupId: ${groupId}, postId: ${postId}`);
  console.log(`게시글 수정 모달, 받은 post: ${post}`);

  // 이미지 미리보기 관련 useEffect
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    setIsUpdating(true);

    let newImageUrl = imageUrl;

    try {
      if (selectedFile) {
        if (imageUrl) {
          await deleteImage(imageUrl);
          console.log("그룹 기존 이미지 삭제 완료");
        }

        newImageUrl = await uploadImage(selectedFile, "posts");
        setImageUrl(newImageUrl);
        console.log("새 이미지 업로드 완료");
      }
      const updatedData = {
        title,
        imageUrl: newImageUrl,
        content,
        memoryPlace,
        tags: tagList,
      };

      console.log("업데이트 할 데이터: ", updatedData);

      await updatePost(groupId, postId, updatedData);
      console.log("게시글 수정 완료");
      alert("게시글 수정 완료!");

      onClose();

      window.location.reload();
    } catch (err) {
      console.error("수정 모달, 게시글 수정 실패: ", err);
      alert("게시글 수정 실패. 다시 시도해주세요.");
    } finally {
      setIsUpdating(false);
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

  const handleImageUpdate = async (e) => {
    const newImage = e.target.files[0];
    if (!newImage) return;

    // 파일 크기 확인 (5MB로 제한해두기)
    if (newImage.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setIsImageUploading(true);
    console.log("게시글 새 이미지 업로드 시작: ", newImage.name);

    try {
      const newImageUrl = await uploadImage(newImage, "posts");

      if (!newImageUrl) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }

      if (imageUrl && imageUrl !== post.imageUrl) {
        try {
          await deleteImage(imageUrl);
          console.log("기존 게시글 이미지 삭제 완료");
        } catch (err) {
          console.error("기존 게시글 이미지 삭제 실패: ", err);
        }
      }

      setImageUrl(newImageUrl);
    } catch (err) {
      console.error("이미지 업데이트 실패: ", err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요");
    } finally {
      setIsImageUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-yellow-300">
      <div>
        <p>게시글 수정</p>
        <button onClick={onClose} disabled={isUpdating}>
          X
        </button>
      </div>
      <form onSubmit={handleUpdatePost}>
        <div>
          <label>제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>이미지</label>
          <img
            src={previewUrl || imageUrl || null}
            alt="게시글 이미지"
            className="w-50 h-50 object-contain"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isImageUploading}
          />
          {isImageUploading && <p>이미지 업로드 중...</p>}{" "}
          {imageUrl && !isImageUploading && <p>이미지 업로드 완료!</p>}
        </div>

        <div>
          <label>본문</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <div>
          <label>추억의 장소</label>
          <input
            value={memoryPlace}
            onChange={(e) => setMemoryPlace(e.target.value)}
            required
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
          <button type="button" onClick={onClose} disabled={isUpdating}>
            취소
          </button>
          <button
            type="submit"
            disabled={isUpdating || isImageUploading}
            className="bg-green-300"
          >
            {isUpdating ? "수정 중..." : "수정하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostUpdateModal;
