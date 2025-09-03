import defaultImg from "../assets/react.svg";
import { useNavigate } from "react-router-dom";

function PostCard({ groupId, postInfo }) {
  const navigate = useNavigate();

  const navigateToDetail = () => {
    navigate(`/groups/${groupId}/${postInfo.postId}`);
  };

  return (
    <div onClick={navigateToDetail}>
      <img
        src={postInfo.imageURl || defaultImg}
        alt="게시글 이미지"
        className="w-50 h-50 object-contain"
      />
      <p>{postInfo.title}</p>
    </div>
  );
}

export default PostCard;