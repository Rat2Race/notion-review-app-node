import axios from "axios";

const API = axios.create({
  baseURL: "/api",
});

export const oauthCallback = (code) =>
  API.post("/oauth/callback", {
    code,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  });

export const getNotionPages = (userId, pageId) =>
  API.post("/search", { userId, pageId });

export const generateQuiz = (userId, pageId) =>
  API.post("/quiz", { userId, pageId });
