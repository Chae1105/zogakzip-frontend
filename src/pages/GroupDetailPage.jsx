import GroupUpdateModal from "../components/GroupUpdateModal";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

function GroupDetailPage() {
  const groupId = useParams().groupId;
  const [groups, setGroups] = useState({});
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchGroupDetail() {
      try {
        const groupInfo = await getDoc(doc(db, "groups", groupId)); // groupId 문서의 데이터만 받아오기
        const groupsData = groupInfo.data();
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching groups: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGroupDetail();
  }, []);

  return (
    <div>
      <h2>그룹 상세 페이지</h2>
      <button className="bg-pink-500" onClick={() => setIsOpen(true)}>
        그룹 수정
      </button>
      {isOpen && (
        <GroupUpdateModal
          group={groups}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default GroupDetailPage;
