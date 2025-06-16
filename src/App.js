import React, { useEffect, useRef, useState } from "react";
import { oauthCallback, generateQuiz } from "./api";
import NotionAuth from "./components/NotionAuth";
import PageList from "./components/PageList";
import Quiz from "./components/Quiz";

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [quiz, setQuiz] = useState(null);

  const isAuthProcessing = useRef(false); // useRef는 렌더링과 무관하게 값 유지

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !userId && !isAuthProcessing.current) {
      isAuthProcessing.current = true; // 1회만 실행
      oauthCallback(code)
        .then((res) => {
          const uid = res.data.userId;
          setUserId(uid);
          localStorage.setItem("userId", uid);
          window.history.replaceState(null, null, window.location.pathname);
        })
        .finally(() => {
          isAuthProcessing.current = false;
        });
    }
  }, [userId]);

  const handleSelectPage = (pageId) => {
    setSelectedPageId(pageId);
    generateQuiz(userId, pageId).then((res) => {
      setQuiz(res.data.quiz);
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    sessionStorage.removeItem("accessToken");
    setUserId(null);
    setSelectedPageId(null);
    setQuiz(null);
  };

  if (!userId) return <NotionAuth />;

  return (
    <div>
      <button onClick={handleLogout}>로그아웃</button>
      {!selectedPageId && (
        <PageList userId={userId} onSelectPage={handleSelectPage} />
      )}
      {quiz && <Quiz quiz={quiz} />}
    </div>
  );
};

export default App;
