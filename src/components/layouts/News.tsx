import React from "react";
import type { NewsProps } from "@interfaces/components/news";
import "@styles/components/news.scss";
import { useNavigate } from "react-router-dom";

const NewsCarousel: React.FC<NewsProps> = (props) => {
  const { listNews } = props;
  const navigate = useNavigate();

  return (
    <div className="news-carousel-container">
      {listNews.map((item) => (
        <div className="news-carousel-item-wrap" key={item.id}>
          <div className="news-carousel-item-poster d-flex flex-col items-center">
            <img src={item.poster} alt="" />
            <div className="news-carousel-item-poster-overlay" />
            <div className="news-carousel-item-title-wrap d-flex flex-col items-center justify-center gap-3">
              <p className="news-carousel-item-title text-font-semibold font-size-base text-uppercase">
                {item.title}
              </p>
              <div
                className="news-carousel-item-button d-flex flex-row justify-center items-center"
                onClick={() => navigate(`/news/${item.id}/${item.slug}`)}
              >
                <p className="text-font-semibold font-size-sm text-uppercase">
                  Discover More
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsCarousel;
