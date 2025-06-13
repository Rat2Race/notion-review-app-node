import React, { useEffect, useState } from "react";
import { getNotionPages } from "../api";

const PageList = ({ userId, onSelectPage }) => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      console.log("[PageList] getNotionPages 호출 전 userId:", userId);
      const res = await getNotionPages(userId, undefined);
      setPages(res.data);
      setLoading(false);
    };

    fetchPages();
  }, [userId]);

  if (loading) return <div>로딩 중...</div>;

  return (
    <ul>
      {pages.results.map((page) => (
        <li key={page.id}>
          <button onClick={() => onSelectPage(page.id)}>
            {page.properties.title?.title[0]?.plain_text || "제목 없음"}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default PageList;
