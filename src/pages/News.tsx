import Header from "@components/common/Header";
import "@styles/pages/news.scss";
import React, { useEffect, useState } from "react";
import Footer from "@components/common/Footer";
import { useNavigate } from "react-router-dom";
import type { NewsData } from "@interfaces/components/news";
import newsApi from "@api/services/newsApi";

export const News: React.FC = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState<NewsData[]>([]);

  const fetchNews = async () => {
    try {
      const response = await newsApi.getAll();
      const items: NewsData[] = Array.isArray(response.data)
        ? response.data.filter((item) => item.status === "active")
        : [];
      setNews(items);
    } catch (error) {
      console.error("Failed to fetch News:", error);
      setNews([]);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="news justify-center items-center">
        <div className="news-container gap-3">
          {news.length === 0 && (
            <p className="text-font-regular font-size-sm">
              No news articles have been posted yet.
            </p>
          )}
          {news.map((news, index) => (
            <div
              className="news-item-container d-flex flex-col items-center gap-1"
              key={index}
            >
              <div
                className="news-poster-wrap"
                onClick={() => navigate(`/news/${news.id}/${news.slug}`)}
              >
                <img src={news.poster} alt="news" className="news-poster" />
              </div>
              <div className="news-item-content d-flex flex-col gap-1">
                <p className="text-font-light font-size-sm">
                  {new Date(news.updatedAt!).toLocaleString("en-US", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p className="text-font-semibold font-size-sm text-uppercase">
                  {news.title}
                </p>
                <p className="news-description text-font-regular font-size-xs">
                  {news.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};
