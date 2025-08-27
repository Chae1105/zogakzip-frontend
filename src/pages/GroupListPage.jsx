import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import GroupCard from "../components/GroupCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 그룹 생성 버튼 누르면 그룹 생성 페이지로 이동

function GroupListPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const allGroups = await getDocs(collection(db, "groups")); // groups 컬렉션의 전체 데이터 다 받아오기
        const groupsData = allGroups.docs.map((doc) => ({
          groupId: doc.id,
          ...doc.data(),
        }));
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching groups: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGroups();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>그룹 목록 페이지</h1>
      <button className="bg-pink-300" onClick={() => navigate("/createGroup")}>
        그룹 생성하기
      </button>
      <div>
        {groups.map((group) => (
          <GroupCard key={group.groupId} groupInfo={group} />
        ))}
      </div>
    </div>
  );
}

export default GroupListPage;
