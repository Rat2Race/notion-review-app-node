import React, { useEffect, useState } from "react";

const NOTION_AUTH_URL = process.env.REACT_APP_NOTION_AUTH_URL;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

function App() {
  const [oauthMsg, setOauthMsg] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const [pageList, setPageList] = useState([]);
  const [selectedPage, setSelectedPage] = useState("");
  const [quizResult, setQuizResult] = useState("");

  // 1) Notion 로그인 버튼
  const handleLogin = () => {
    window.location.href = NOTION_AUTH_URL;
  };

  // 2) OAuth 인증 후 토큰 발급
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (code && !window.sessionStorage.getItem("notion_code_used")) {
      window.sessionStorage.setItem("notion_code_used", "true");
      setOauthMsg("Notion 인증 코드 받음. 토큰 발급 요청 중...");
      fetch("http://localhost:5000/api/v1/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            setOauthMsg("Notion 토큰 발급 성공! (페이지 목록 불러오는 중)");
            setAccessToken(data.access_token);
            setUserId(data.user_id);
            // 토큰 받은 후 페이지 목록 불러오기 자동 호출
            fetchPageList(data.user_id);
            localStorage.setItem("isLoggedIn", "true");
          } else {
            setOauthMsg(
              "토큰 발급 실패! " + (data.error || JSON.stringify(data))
            );
          }
        })
        .catch((err) => setOauthMsg("에러: " + err.message));
    }
  }, []);

  // 3) Notion 페이지/DB 리스트 불러오기
  const fetchPageList = (user_id) => {
    setOauthMsg("페이지/DB 목록 불러오는 중...");
    fetch("http://localhost:5000/api/v1/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        query: "", // 전체, 특정 검색어 사용도 가능
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.results) {
          setPageList(data.results);
          setOauthMsg("접근 가능한 Notion 페이지/DB 리스트");
        } else {
          setOauthMsg(
            "페이지/DB 목록 불러오기 실패: " +
              (data.error || JSON.stringify(data))
          );
        }
      })
      .catch((err) => setOauthMsg("에러: " + err.message));
  };

  // 4) 퀴즈 생성 요청
  const handleMakeQuiz = () => {
    if (!selectedPage) return alert("페이지를 선택하세요!");
    setQuizResult("퀴즈 생성 중...");
    fetch("http://localhost:5000/api/v1/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        page_id: selectedPage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setQuizResult(data.quiz || "퀴즈 생성 실패");
      })
      .catch((err) => setQuizResult("에러: " + err.message));
  };

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto" }}>
      <h2>Notion 자동 퀴즈 생성기</h2>
      {!accessToken && <button onClick={handleLogin}>Notion 로그인</button>}
      <div style={{ margin: "20px 0", color: "#555" }}>{oauthMsg}</div>

      {/* 페이지/DB 선택 UI */}
      {accessToken && (
        <>
          <button
            onClick={() => fetchPageList(userId)}
            style={{ marginBottom: 12 }}
          >
            Notion 페이지/DB 새로고침
          </button>
          <div>
            <label>페이지/DB 선택:&nbsp;</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              style={{ width: 300, marginRight: 12 }}
            >
              <option value="">- 선택하세요 -</option>
              {pageList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title?.[0]?.plain_text ||
                    item.properties?.Name?.title?.[0]?.plain_text ||
                    item.object + " (" + item.id.slice(-6) + ")"}
                </option>
              ))}
            </select>
            <button onClick={handleMakeQuiz} disabled={!selectedPage}>
              이 페이지로 퀴즈 생성
            </button>
          </div>
        </>
      )}

      {/* 퀴즈 결과 출력 */}
      {quizResult && (
        <div style={{ marginTop: 40 }}>
          <h3>AI가 생성한 퀴즈</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              padding: 18,
              borderRadius: 8,
              fontSize: 16,
            }}
          >
            {quizResult}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
