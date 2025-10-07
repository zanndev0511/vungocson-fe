import React, { useEffect, useState } from "react";
import Header from "@components/common/Header";
import "@styles/pages/about.scss";
import Footer from "@components/common/Footer";
import aboutApi from "@api/services/aboutApi";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

export const About: React.FC = () => {
   const [content, setContent] = useState<string>("");

   const fetchAbout = async () => {
    try {
      const res = await aboutApi.get();
      setContent(res.data.content);
    } catch (err) {
      console.error("Failed to fetch About:", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  return (
    <>
     <Header backgroundColor="black"/>
      <div className="about-container d-flex flex-column items-center justify-center text-font-regular width-fullsize">
        {parse(DOMPurify.sanitize(content))}
      </div>
      <div className="mt-5">
        <Footer />
      </div>
    </>
  );
};
