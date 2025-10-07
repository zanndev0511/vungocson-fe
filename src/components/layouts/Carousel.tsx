import React, { useState, useEffect } from "react";
import "@styles/components/carousel.scss";
import { CarouselProps } from "@interfaces/components/carousel";
import { ICONS } from "@constants/icons";
import { useNavigate } from "react-router-dom";

const Carousel: React.FC<CarouselProps> = (props) => {
  const { itemProducts } = props;
  const navigate = useNavigate();

  const visibleCount = 5;
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex >= itemProducts.length - visibleCount ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex <= 0 ? itemProducts.length - visibleCount : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= itemProducts.length - visibleCount ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [itemProducts.length]);

  return (
    <div className="carousel-container d-flex flex-row items-center">
      <div
        className="carousel-track d-flex flex-row gap-3"
        style={{
          transform: `translateX(-${(currentIndex * 100) / visibleCount}%)`,
          width: `${(itemProducts.length * 100) / visibleCount}%`,
        }}
      >
        {itemProducts.map((itemProduct, index) => (
          <div
            key={index}
            className="carousel-item d-flex flex-col items-start gap-3 relative"
          >
            <div className="carousel-image-wrap" onClick={() => navigate(`/shop/product/${itemProduct.id}/${itemProduct.slug}`)}>
              <img
                src={itemProduct.productGallery[0]}
                alt={itemProduct.name}
                className="carousel-image"
              />
            </div>

            <div className="carousel-item-name-wrap d-flex flex-col items-center">
              <p className="carousel-item-name text-font-semibold text-color text-start">
                {itemProduct.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="carousel-btn prev" onClick={handlePrev}>
        <img src={ICONS.left} alt="" />
      </div>
      <div className="carousel-btn next" onClick={handleNext}>
        <img src={ICONS.right} alt="" />
      </div>
    </div>
  );
};
export default Carousel;
