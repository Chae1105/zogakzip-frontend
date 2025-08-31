import { useState, useEffect } from "react";
import { fetchUserDetail, updateUser } from "../services/userService";
import { auth } from "../firebase";
import { deleteImage, uploadImage } from "../services/fileService";
import React from "react";

function UserInfo({ userId }) {
  const [user, setUser] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userName, setUserName] = useState("");

  const [isImageUploading, setIsImageUploading] = useState(false); // 이미지 파일 업로드
  const [isUpdating, setIsUpdating] = useState(false); // 수정 상태 확인

  useEffect(() => {
    console.log("useEffect 실행");
    async function fetchUserData() {
      try {
        console.log("함수 정의 부분 들어옴");
        const userData = await fetchUserDetail(userId);
        setUser(userData);
        console.log("유저 데이터: ", userData);
        setEmail(userData.email);
        setPassword(userData.password);
        setImageUrl(userData.imageUrl);
        setUserName(userData.userName);
      } catch (err) {
        console.error("유저 정보 불러오기 실패: ", err);
      }
    }

    console.log("userId 있는지 확인하기");
    if (userId) {
      console.log("fetchUserData 함수 실행 전");
      fetchUserData();
      console.log("fetchUserData 함수 실행 후");
    }
  }, []);

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

    if (isImageUploading) {
      alert("이미지 업로드 진행 중.. 잠시 후 다시 시도해주세요!");
      return;
    }

    setIsUpdating(true);

    try {
      const userData = {
        email,
        password,
        userName,
        imageUrl,
      };

      console.log("업데이트 할 데이터: ", userData);
      console.log("유저 ID: ", userId);

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
                  <img
                    src={user.imageUrl || null}
                    alt="프로필 이미지"
                    className="w-50 h-50"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
