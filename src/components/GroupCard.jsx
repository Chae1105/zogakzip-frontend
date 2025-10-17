import defaultImg from "../assets/react.svg";
import { useNavigate } from "react-router-dom";

function GroupCard({ groupInfo }) {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    console.log(groupInfo.groupId);
    navigate(`/groups/${groupInfo.groupId}`);
  };

  return (
    <div
      onClick={navigateToDetail}
      className="flex-col w-80 h-60 bg-pink-200 border-2 hover:bg-pink-500 rounded-2xl "
    >
      <img
        src={groupInfo.imageUrl || defaultImg}
        alt="그룹 대표 이미지"
        className="w-full h-32 object-cover rounded-t-2xl"
        loading="lazy"
      />
      <p>{groupInfo.groupName}</p>
      <p>{groupInfo.introduction}</p>
      <div className="flex">
        {groupInfo.tags.map((tag) => (
          <div key={tag} className="flex">
            <p># {tag}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupCard;
