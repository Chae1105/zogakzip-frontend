import { useState } from "react";

const groupArc = {
  groupName: "name",
  groupPassword: "password",
  imageUrl: null,
  introduction: "소개",
  isPublic: true,
  likeCount: 0,
  members: [""],
  postCount: 0,
};

function GroupUpdateModal({ group, isOpen, onClose }) {
  const [groupInfo, setGroupInfo] = useState(group);
  console.log("그룹정보: ", groupInfo);
  const [groupName, setGroupName] = useState(groupInfo.groupName);
  const [groupPassword, setGroupPassword] = useState(groupInfo.groupPassword);
  const [introduction, setIntroduction] = useState(groupInfo.introduction);

  return (
    <div className="bg-sky-500">
      {isOpen && (
        <div>
          <button className="bg-white-500" onClick={onClose}>
            X
          </button>
          <form>
            <input
              type="name"
              value={groupName}
              placeholder={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <input
              type="password"
              value={groupPassword}
              placeholder={groupPassword}
              onChange={(e) => setGroupPassword(e.target.value)}
            />
            <input
              type="introduction"
              value={introduction}
              placeholder={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
            />
            <button className="bg-black-500">수정하기</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default GroupUpdateModal;
