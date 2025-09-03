import { useState } from "react";
import { updatePost } from "../services/postService";
import { deleteImage, uploadImage } from "../services/fileService";

function PostUpdateModal({ groupId, postId, post, isOpen, onClose }) {
  const [postData, setPostData] = useState(post);

  const [title, setTitle] = useState(post.title);
  const [imageUrl, setImageUrl] = useState(post.imageUrl);
  const [content, setContent] = useState(post.content);
  const [memoryPlace, setMemoryPlace] = useState(post.memoryPlace);

  const [isUpdating, setIsUpdating] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);

  console.log(`게시글 수정 모달, 받은 groupId: ${groupId}, postId: ${postId}`);
  console.log(`게시글 수정 모달, 받은 post: ${post}`);

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    if (isImageUploading) {
      alert("이미지 업로드 중.. 잠시 후 다시 시도해주세요!");
      return;
    }

    setIsUpdating(true);

    try {
      const updatedData = {
        title,
        imageUrl,
        content,
        memoryPlace,
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
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpdate}
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
