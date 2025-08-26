import defaultImg from "../assets/react.svg";
import { useNavigate } from "react-router-dom";

function GroupCard({ groupInfo }) {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    console.log(groupInfo.groupId);
    navigate(`/groups/${groupInfo.groupId}`);
  };

  return (
    <div onClick={navigateToDetail}>
      <img src={groupInfo.imageUrl || defaultImg} alt="그룹 대표 이미지" />
      <h2>{groupInfo.groupName}</h2>
      <h3>{groupInfo.introduction}</h3>
    </div>
  );
}

export default GroupCard;
