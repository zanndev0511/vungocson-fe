import React, { useEffect, useState } from "react";
import type { CelebMomentProps } from "@interfaces/components/celebMoments";
import "@styles/components/celebMoments.scss";

export const CelebMoments: React.FC<CelebMomentProps> = (props) => {
  const { celebrities } = props
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + itemsPerPage) % celebrities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [celebrities.length]);

  const getVisibleCelebrities = () => {
    const visible = [];
    for (let i = 0; i < itemsPerPage; i++) {
      visible.push(celebrities[(currentIndex + i) % celebrities.length]);
    }
    return visible;
  };

  return (
    <div className="celeb-moments-container mt-5">
      <p className="font-size-xl text-uppercase text-font-regular">
        Celebrities in <span className="text-font-semibold text-uppercase">Happy Forever</span>
      </p>
      <div className="celeb-slider mt-3">
        {getVisibleCelebrities().map((celeb, index) => (
          <div key={index} className="celeb-slide active">
            <img src={celeb.image} alt=" " className="celeb-image" />
          </div>
        ))}
      </div>
    </div>
  );
};
