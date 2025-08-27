import { createGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function CreateGroupPage() {
  const [groupName, setGroupName] = useState("");
  const [groupPassword, setGroupPassword] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const navigate = useNavigate(); // 그룹 생성 후 메인페이지 이동 (일단은)

  const handleCreateGroup = async () => {
    const groupData = {
      groupName,
      groupPassword,
      introduction,
      imageUrl,
      isPublic,
    };

    const response = await createGroup(groupData);
    if (response) console.log("그룹 생성 완료");
    navigate("/");
  };

  return (
    <div>
      <form>
        <input
          type="name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="password"
          value={groupPassword}
          onChange={(e) => setGroupPassword(e.target.value)}
        />
        <input
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <input
          type="file"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <button onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "공개" : "비공개"}
        </button>
      </form>
      <button onClick={handleCreateGroup}>생성하기</button>
    </div>
  );
}

export default CreateGroupPage;
