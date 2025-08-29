import { useState } from "react";
import { deleteGroup } from "../services/groupService";
import { useNavigate } from "react-router-dom";

function DeleteModal({ groupData, mode, docId, isOpen, onClose }) {
  const [inputPassword, setInputPassword] = useState("");
  const navigate = useNavigate();

  const [isDeleting, setIsDeleting] = useState(false); // 수정 상태 관리

  const handleDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      await deleteGroup(docId, inputPassword, groupData);
      alert("그룹이 삭제되었습니다.");
      navigate("/groups");
    } catch (err) {
      console.error("그룹 삭제 실패: ", err);
      alert("그룹 삭제 실패. 다시 시도해주세요.");
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
      <form onSubmit={handleDelete}>
        <div>
          <p>{mode} 삭제하기</p>
          <button type="button" onClick={onClose}>
            X
          </button>
        </div>
        <label>비밀번호 입력</label>
        <input
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          required
        />
        <div>
          <button type="button" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="bg-black-500 text-white-500">
            삭제하기
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeleteModal;
