import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import GroupCard from "../components/GroupCard";
import { useEffect, useState } from "react";

function GroupListPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const allGroups = await getDocs(collection(db, "groups"));
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
    console.log("그룹 데이터: ", groups);
    fetchGroups();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div>
      <h1>그룹 목록 페이지</h1>
      <div>
        {groups.map((group) => (
          <GroupCard key={group.groupId} groupInfo={group} />
        ))}
      </div>
    </div>
  );
}

export default GroupListPage;
