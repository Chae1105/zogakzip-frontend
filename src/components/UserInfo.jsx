import { useState, useEffect } from "react";
import {
  fetchUserDetail,
  updateUser,
  deleteUserData,
} from "../services/userService";
import { auth } from "../firebase";
import { deleteImage, uploadImage } from "../services/fileService";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function UserInfo({ userId, userInfo }) {
  console.log("UserInfo, userData: ", userInfo);
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");

  const [isImageUploading, setIsImageUploading] = useState(false); // 이미지 파일 업로드
  const [isUpdating, setIsUpdating] = useState(false); // 수정 상태 확인

  // 회원탈퇴 관련
  const { withDraw } = useAuth();
  const [inputPassword, setInputPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  // 이미지 미리보기 URL과 선택된 파일 객체를 위한 상태
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // userData 업데이트 관련 useEffect
  useEffect(() => {
    console.log("첫 번째 useEffect 실행");
    if (userInfo) {
      setUser(userInfo);
      setEmail(userInfo.email || "");
      setPassword(userInfo.password || "");
      setImageUrl(userInfo.imageUrl || "");
      setUserName(userInfo.userName || "");
    }
  }, [userInfo]);

  // 이미지 프리뷰 관련 useEffect
  useEffect(() => {
    // 이미지 미리보기 관련-추가
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // handleUploadImage 함수를 변경하기 위한 함수
  // Firebase에 바로 업로드하지 않고, 미리보기 기능만 수행하도록
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는  5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // 이미지 파일 업로드
  const handleUploadImage = async (e) => {
    const imageFile = e.target.files[0];
    if (!imageFile) return;

    if (imageFile.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다. 다시 시도해주세요.");
      return;
    }

    setIsImageUploading(true); // 이미지 파일 업로드 시작

    try {
      console.log("이미지 업로드 시작: ", imageFile.name);
      const fileUrl = await uploadImage(imageFile, "users");

      if (fileUrl) {
        console.log("업로드된 파일 URL: ", fileUrl); // 그냥 확인 과정

        // 만약 기존 이미지 파일이 존재할 경우
        if (imageUrl && imageUrl !== fileUrl) {
          try {
            await deleteImage(imageUrl); // 기존 이미지 삭제
            console.log("기존 이미지 삭제 완료");
          } catch (err) {
            console.error("기존 이미지 삭제 실패: ", err);
          }
        }

        setImageUrl(fileUrl);
      } else {
        throw new Error("파일 URL을 받지 못했습니다.");
      }
    } catch (err) {
      console.error("이미지 업로드 실패: ", err);
      alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      setImageUrl("");
    } finally {
      setIsImageUploading(false);
    }
  };

  // 유저 정보 수정
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    // 혹시 user 데이터 없을까봐 확인
    if (!user) {
      alert("유저 정보를 불러오는 중 입니다. 다시 시도해주세요!");
      return;
    }

    /*
    if (isImageUploading) {
      alert("이미지 업로드 진행 중.. 잠시 후 다시 시도해주세요!");
      return;
    }
      */

    setIsUpdating(true);

    // 미리보기 관련- 추가
    let newImageUrl = imageUrl;

    try {
      // 이미지 미리보기 관련- 추가부분
      if (selectedFile) {
        // 기존 이미지 삭제 로직
        if (imageUrl) {
          await deleteImage(imageUrl);
          console.log("기존 이미지 삭제 완료");
        }

        newImageUrl = await uploadImage(selectedFile, "users");
        setImageUrl(newImageUrl);
        console.log("새 이미지 업로드 완료");
      }
      const userData = {
        email,
        password,
        userName,
        imageUrl: newImageUrl,
      };

      await updateUser(userId, userData);
      console.log("유저 정보 수정 완료");
      alert("유저 정보 수정 완료!");

      // 페이지 새로고침으로 변경된 데이터 반영
      window.location.reload();
    } catch (err) {
      console.error("유저 정보 수정 실패: ", err);
      alert("유저 정보 수정 실패. 다시 시도해주세요.");
    } finally {
      setIsUpdating(false);
    }
  };

  // 유저 정보 삭제 (회원탈퇴)
  const handleDeleteUser = async (e) => {
    try {
      setIsDeleting(true);

      await withDraw(inputPassword, user);
      alert("회원탈퇴가 완료되었습니다!");

      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleteModalOpen(false);
      isDeleting(false);
      setInputPassword("");
    }
  };

  if (!user) return <div>회원 정보 로딩 중...</div>;

  return (
    <div>
      {isUpdating ? (
        <div>
          <form
            onSubmit={handleUpdateUser}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="flex-row">
              <div className="flex-col">
                <div>
                  {/* 수정: 미리보기 URL 있으면 그걸, 없으면 기존 URL 사용 */}
                  <img
                    src={previewUrl || user.imageUrl || null}
                    alt="프로필 이미지"
                    className="w-50 h-50"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange} // 수정: handleUploadImage -> handleFileChange
                    disabled={isImageUploading}
                  />
                  {/* 사용자에게 진행상황 보여주기 */}
                  {isImageUploading && <p>이미지 업로드 중...</p>}{" "}
                  {imageUrl && !isImageUploading && <p>이미지 업로드 완료!</p>}
                </div>
                <div>
                  <button type="button" onClick={() => setIsUpdating(false)}>
                    취소
                  </button>
                  <button type="submit">수정</button>
                </div>
              </div>
              <div className="flex-col">
                <div className="flex-row">
                  <label>닉네임</label>
                  <input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="flex-row">
                  <label>이메일</label>
                  <input value={email} readOnly />
                </div>
                <div className="flex-row">
                  <label>비밀번호</label>
                  <input value={password} readOnly />
                </div>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div>
          <div className="flex-row">
            <div className="flex-col">
              <img
                src={user.imageUrl || null}
                alt="유저 프로필 사진"
                className="w-50 h-50"
              />
              <button onClick={() => setIsUpdating(true)}>정보 수정하기</button>
            </div>

            <div className="flex-col">
              <p>이름 : {user.userName}</p>
              <p>이메일 : {user.email}</p>
              <p>비밀번호 : {user.password}</p>
            </div>

            <div>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="font-red-500"
              >
                회원탈퇴
              </button>
              {isDeleteModalOpen && (
                <div className="modal">
                  <p>회원탈퇴</p>
                  <input
                    type="password"
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="비밀번호를 입력해주세요"
                  />
                  <button
                    onClick={() => {
                      setInputPassword("");
                      setIsDeleteModalOpen(false);
                    }}
                  >
                    취소
                  </button>
                  <button onClick={handleDeleteUser} disabled={isDeleting}>
                    {isDeleting ? "탈퇴 중..." : "탈퇴하기"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
