import React from "react";

const CLIENT_ID = process.env.REACT_APP_NOTION_CLIENT_ID;
const REDIRECT_URI = encodeURIComponent(process.env.REACT_APP_REDIRECT_URI);
const AUTH_URL = `https://api.notion.com/v1/oauth/authorize?client_id=${CLIENT_ID}&response_type=code&owner=user&redirect_uri=${REDIRECT_URI}`;

const NotionAuth = () => {
  const handleLogin = () => {
    window.location.href = AUTH_URL;
  };

  return <button onClick={handleLogin}>Notion으로 로그인하기</button>;
};

export default NotionAuth;
