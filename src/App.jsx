import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./App.css";
import TopBar from "./components/TopBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import GroupDetailPage from "./pages/GroupDetailPage";
import GroupListPage from "./pages/GroupListPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";

function App() {
  return (
    <>
      <Router>
        <div>
          <TopBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="mypage" element={<MyPage />} />

            <Route path="/groups" element={<GroupListPage />} />
            <Route path="/groups/:groupId" element={<GroupDetailPage />} />

            <Route path="/createGroup" element={<CreateGroupPage />} />

            <Route
              path="/groups/:groupId/createPost"
              element={<CreatePostPage />}
            />

            <Route
              path="/groups/:groupId/:postId"
              element={<PostDetailPage />}
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
