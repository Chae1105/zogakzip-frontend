// PostCard를 나열하는 컴포넌트
// GroupDetailPage에서 게시글 작성 버튼 누르기
// -> 게시글 생성 페이지에 groupId 넘겨주기

import { collection, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import PostCard from "./PostCard";

function PostList({ groupId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const allPosts = await getDocs(
          collection(db, "groups", groupId, "posts")
        );
        const postsData = allPosts.docs.map((doc) => ({
          postId: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
      } catch (err) {
        console.error("게시글 불러오기 실패: ", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div>게시글 로딩 중...</div>;

  return (
    <div>
      <h1>게시글 목록</h1>
      <div className="flex">
        {posts.map((post) => (
          <PostCard key={post.postId} groupId={groupId} postInfo={post} />
        ))}
      </div>
    </div>
  );
}

export default PostList;
