import React, { useEffect, useState } from "react";
import { oauthCallback, generateQuiz } from "./api";
import NotionAuth from "./components/NotionAuth";
import PageList from "./components/PageList";
import Quiz from "./components/Quiz";

const App = () => {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [selectedPageId, setSelectedPageId] = useState(null);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code && !userId) {
      oauthCallback(code).then((res) => {
        const uid = res.data.userId;
        setUserId(uid);
        localStorage.setItem("userId", uid);
        window.history.replaceState(null, null, window.location.pathname);
      });
    }
  }, [userId]);

  const handleSelectPage = (pageId) => {
    setSelectedPageId(pageId);
    generateQuiz(userId, pageId).then((res) => {
      setQuiz(res.data.quiz);
    });
  };

  if (!userId) return <NotionAuth />;

  return (
    <div>
      {!selectedPageId && (
        <PageList userId={userId} onSelectPage={handleSelectPage} />
      )}
      {quiz && <Quiz quiz={quiz} />}
    </div>
  );
};

export default App;
