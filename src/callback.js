import React, { useEffect, useState } from "react";

function NotionRedirect() {
  const [result, setResult] = useState("인증 처리 중...");

  useEffect(() => {
    // 현재 URL에서 code 추출
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");

    if (!code) {
      setResult("code 파라미터가 없습니다.");
      return;
    }

    // 백엔드에 code 전달하여 토큰 교환 요청
    fetch("http://localhost:5000/api/notion-oauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: code,
        redirect_uri: window.location.origin, // Notion에 등록한 redirect_uri와 일치해야 함
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          setResult("Notion 연동 성공! 🎉");
          // 추가로 토큰을 로컬스토리지 등에 저장하거나, 다음 단계로 이동
        } else {
          setResult("토큰 발급 실패: " + (data.error || JSON.stringify(data)));
        }
      })
      .catch((err) => setResult("에러: " + err.message));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h2>Notion 인증 콜백 페이지</h2>
      <div>{result}</div>
    </div>
  );
}

export default NotionRedirect;
