import Header from "@components/common/Header";
import React, { useEffect, useState } from "react";
import "@styles/pages/newsDetail.scss";
import { useParams } from "react-router-dom";
import newsApi from "@api/services/newsApi";
import DOMPurify from "dompurify";
import parse from "html-react-parser";
import Footer from "@components/common/Footer";

export const NewsDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");

  const fetchNews = async () => {
    try {
      const res = await newsApi.getById(id!);
      setContent(res.content);
      setTitle(res.title);
    } catch (err) {
      console.error("Failed to fetch news content:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [id]);

  return (
    <>
      <Header backgroundColor="black" />
      <div className="newsDetail d-flex flex-col items-start gap-8">
        <div className="newsDetail-content-wrap d-flex flex-col items-start width-fullsize">
              <div className="newsDetail-content">
                <p className="text-font-semibold font-size-3xl text-start text-uppercase">
                  {title}
                </p>
                {parse(DOMPurify.sanitize(content))}
              </div>
            </div>
      </div>
      <div>
        <Footer/>
      </div>
    </>
  );
};
